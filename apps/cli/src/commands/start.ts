// import execa from "execa";
import { decryptString } from "@47ng/cloak";
import { intro, outro, spinner } from "@clack/prompts";
import { Command, Flags, ux } from "@oclif/core";
import axios from "axios";
import { bold, cyan, green, grey, red } from "kleur/colors";
import { exec, spawn } from "node:child_process";
import { readFromDotEnvless } from "../lib/dotEnvless";
import OpenPGP from "../lib/encryption/openpgp";
import { API_VERSION, LINKS, triggerCancel } from "../lib/helpers";
import { getCliConfigFromKeyStore } from "../lib/keyStore";
import { getPrivateKeyFromKeyStore } from "../lib/keyStore";
import type { DecryptedSecretType, EncryptedSecretType } from "../utils/types";

const loader = spinner();

export default class Start extends Command {
  static aliases = ["s"];

  static description = `Inject environment variables and run a command. \n${grey(
    `⚡ This command can be used to start your application on production, staging, development, review apps, on a CI/CD pipeline, platforms or anywhere else.`,
  )}`;

  static examples = [
    `
      $ envless start -r "yarn dev"
      $ envless start --run "npm run start"
    `,
  ];

  static flags = {
    run: Flags.string({
      description: `The command to run`,
      char: "r",
      required: true,
    }),

    help: Flags.help({
      char: "h",
      description: "Show help for the start command",
    }),
  };

  async run(): Promise<void> {
    const version = this.config.version;
    const { flags } = await this.parse(Start);
    const command = flags.run as string;

    this.log(`\n`);
    intro(`✨ Envless CLI v${this.config.version}`);

    const { encryptedSecrets, encryptedProjectKey } =
      await this.getEncryptedSecretsAndProjectKey();

    const decryptedProjectKey = await this.decryptProjectKey(
      encryptedProjectKey,
    );

    const decryptedSecrets: DecryptedSecretType[] = (await this.decryptSecrets(
      encryptedSecrets,
      decryptedProjectKey,
    )) as any;

    loader.stop(
      `${green(bold("✓"))} Decrypted ${decryptedSecrets.length} secrets...`,
    );

    // await this.injectSecrets(decryptedSecrets);

    const childProcess = spawn(command, {
      env: {
        ...process.env,
        ...decryptedSecrets.reduce((acc, secret) => {
          acc[secret.key] = secret.value;
          return acc;
        }, {} as any),
      },

      shell: true,
      stdio: "inherit",
    });

    childProcess.stderr?.on("data", (data) => {
      console.log(`${data}`);
    });

    childProcess.stdout?.on("data", (data) => {
      console.log(`${data}`);
    });

    childProcess.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });

    childProcess.on("error", (error) => {
      console.log(`child process exited with error ${error}`);
    });

    childProcess.on("exit", (code) => {
      console.log(`child process exited with code ${code}`);
    });

    // await execa.command(command);
    // exec(command, (error, stdout, stderr) => {
    //   if (error) {
    //     console.log(`error: ${error.message}`);
    //     return;
    //   }
    //   if (stderr) {
    //     console.log(`stderr: ${stderr}`);
    //     return;
    //   }
    //   console.log(`${stdout}`);
    // });

    outro(`${green(bold("✓"))} Running command: $ ${bold(cyan(command))}`);

    this.log(
      `\nFollowing environment variables have been injected into your process:\n`,
    );
    ux.table(decryptedSecrets as any, {
      key: { header: "Key" },
      id: { header: "ID" },
    });

    this.log(`\n`);
  }

  async getEncryptedSecretsAndProjectKey() {
    const config = await getCliConfigFromKeyStore();
    const envless = readFromDotEnvless();
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        loader.stop(`${red(error.response?.data?.message)}`);
      }
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
    loader.start(`Decrypting ${encryptedSecrets.length} secrets`);
    return await Promise.all(
      encryptedSecrets.map(async (encryptedSecret: EncryptedSecretType) => {
        const { id, encryptedKey, encryptedValue } = encryptedSecret;

        try {
          const key = await decryptString(encryptedKey, decryptedProjectKey);
          const value = await decryptString(
            encryptedValue,
            decryptedProjectKey,
          );
          return { id, key, value } as DecryptedSecretType;
        } catch (error) {
          loader.stop(`Unable to decrypt secrets`);
          triggerCancel();
        }
      }),
    );
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
