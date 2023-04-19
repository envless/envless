import { decryptString } from "@47ng/cloak";
import { intro, isCancel, outro, spinner, text } from "@clack/prompts";
import { Command, Flags } from "@oclif/core";
import axios from "axios";
import execa from "execa";
import { bold, cyan, green, red } from "kleur/colors";
import { readFromDotEnvless } from "../lib/dotEnvless";
import OpenPGP from "../lib/encryption/openpgp";
import { API_VERSION, LINKS, triggerCancel } from "../lib/helpers";
import { getCliConfigFromKeyStore } from "../lib/keyStore";
import { getPrivateKeyFromKeyStore } from "../lib/keyStore";
import type { DecryptedSecretType, EncryptedSecretType } from "../utils/types";

const loader = spinner();

export default class Run extends Command {
  static description = `Inject environment variables and run a command. This command can be used to start your application locally, on a CI/CD pipeline, platforms or anywhere else.`;

  static examples = [
    `
      $ envless run -c "yarn dev"
      $ envless run --command "npm run start"
    `,
  ];

  static flags = {
    command: Flags.string({
      description: `The command to run`,
      char: "c",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const version = this.config.version;
    const { flags } = await this.parse(Run);
    const command = flags.command as string;

    intro(`Envless CLI v${this.config.version}`);

    const { encryptedSecrets, encryptedProjectKey } =
      await this.getEncryptedSecretsAndProjectKey();

    const decryptedProjectKey = await this.decryptProjectKey(
      encryptedProjectKey,
    );

    const decryptedSecrets: DecryptedSecretType[] = (await this.decryptSecrets(
      encryptedSecrets,
      decryptedProjectKey,
    )) as any;

    await this.injectSecrets(decryptedSecrets);
    await execa.command(command);
  }

  async getEncryptedSecretsAndProjectKey() {
    const config = await getCliConfigFromKeyStore();
    const envless = await readFromDotEnvless();
    const cliId = process.env.ENVLESS_CLI_ID || config?.id;
    const cliToken = process.env.ENVLESS_CLI_TOKEN || config?.token;
    const { projectId, branch } = envless;

    loader.start(`Fetching secrets...`);

    if (!cliId || !cliToken) {
      loader.stop(
        `Envless is not initialized. Please initialize the Envless CLI by running \n${bold(
          cyan(`$ envless init`),
        )}`,
      );
      triggerCancel();
    }

    if (!projectId) {
      loader.stop(
        `Project is not yet linked with Envless. Please link your project by running \n${bold(
          cyan(`$ envless project link`),
        )}`,
      );
      triggerCancel();
    }

    try {
      const { data: response } = await axios.get(
        `${LINKS.api}/cli/${API_VERSION}/projects/${projectId}/secrets?branch=${branch}`,
        {
          auth: {
            username: cliId as string,
            password: cliToken as string,
          },
        },
      );

      loader.stop(`${green(bold("✓"))} Fetching secrets...`);
      return response;
    } catch (error: any) {
      loader.stop(`${red(error.message)}`);
      triggerCancel();
    }
  }

  async decryptProjectKey(encryptedProjectKey: string) {
    const privateKey =
      process.env.ENVLESS_PRIVATE_KEY || (await getPrivateKeyFromKeyStore());

    if (!privateKey) {
      loader.stop(
        `Private key not found. Please make sure you completed Envless CLI setup before running this command. Please follow the instructions at: \n\nFor development environment\n  ${bold(
          cyan(`${LINKS.devCliDocs}`),
        )}\n\nFor production and CI/CD\n  ${bold(
          cyan(`${LINKS.prodCliDocs}`),
        )}`,
      );

      triggerCancel();
    }

    try {
      const decryptedProjectKey = await OpenPGP.decrypt(
        encryptedProjectKey,
        privateKey as string,
      );

      return decryptedProjectKey;
    } catch (error) {
      loader.stop(
        `Unable to decrypt project key. Please make sure you completed Envless CLI setup before running this command. Please follow the instructions at: \n\nFor development environment\n  ${bold(
          cyan(`${LINKS.devCliDocs}`),
        )}\n\nFor production and CI/CD\n  ${bold(
          cyan(`${LINKS.prodCliDocs}`),
        )}`,
      );

      triggerCancel();
    }
  }

  async decryptSecrets(
    encryptedSecrets: EncryptedSecretType[],
    decryptedProjectKey: string,
  ) {
    loader.start(`Decrypting secrets`);
    let decryptedSecrets: DecryptedSecretType[] = [];
    encryptedSecrets.forEach(async (encryptedSecret: EncryptedSecretType) => {
      const { id, encryptedKey, encryptedValue } = encryptedSecret;

      try {
        const key = await decryptString(encryptedKey, decryptedProjectKey);
        const value = await decryptString(encryptedValue, decryptedProjectKey);
        decryptedSecrets.push({ id, key, value });
      } catch (error) {
        loader.stop(`Unable to decrypt secrets`);
        triggerCancel();
      }
    });

    loader.stop(
      `${green(bold("✓"))} Decrypted ${decryptedSecrets.length} secrets...`,
    );

    return decryptedSecrets;
  }

  async injectSecrets(decryptedSecrets: DecryptedSecretType[]) {
    loader.start(`Injecting secrets...`);

    decryptedSecrets.forEach((secret: any) => {
      const { key, value } = secret;
      process.env[key] = value;
    });

    loader.stop(
      `${green(bold("✓"))} Injected ${decryptedSecrets.length} secrets...`,
    );
  }
}
