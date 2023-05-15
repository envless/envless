import { spinner } from "@clack/prompts";
import { Command, Flags, ux } from "@oclif/core";
import axios from "axios";
import { bold, cyan, grey, red } from "kleur/colors";
import { readFromDotEnvless } from "../../lib/dotEnvless";
import {
  decryptProjectKey,
  decryptSecrets,
  triggerCancel,
} from "../../lib/helpers";
import { API_VERSION, LINKS } from "../../lib/helpers";
import { getCliConfigFromKeyStore } from "../../lib/keyStore";

const loader = spinner();

type EncryptedSecret = {
  id: string;
  encryptedKey: string;
  encryptedValue: string;
};

type SecretResponse = {
  encryptedSecrets: EncryptedSecret[];
  encryptedProjectKey: string;
};

export default class Secrets extends Command {
  static description = `Get All the remote secrets for the current branch`;

  static examples = [
    `
      $ envless secrets
    `,
  ];

  static flags = {
    help: Flags.string({
      description: "Show help for the secrets command",
      char: "h",
    }),

    id: Flags.string({
      description: "Unique identifier for CLI",
      char: "i",
    }),

    token: Flags.string({
      description: "Unique CLI token for authentication",
      char: "t",
    }),
    branch: Flags.string({
      char: "b",
      description: "Envless project's branch name",
      default: "development",
    }),
  };

  private async getSecrets(branch: string) {
    const config = await getCliConfigFromKeyStore();

    const cliId = process.env.ENVLESS_CLI_ID || config?.id;
    const cliToken = process.env.ENVLESS_CLI_TOKEN || config?.token;
    const envless = await readFromDotEnvless();
    const { projectId, branch: branchFromKeyStore } = envless;

    const selectedBranch = branch || branchFromKeyStore;

    loader.start(`Fetching secrets for branch: ${selectedBranch}`);

    if (!cliId || !cliToken) {
      loader.stop(
        `Please initialize the Envless CLI first by running ${bold(
          cyan(`envless init`),
        )}`,
      );
      return;
    }

    try {
      const response = await axios.get(
        `${LINKS.api}/cli/${API_VERSION}/projects/${projectId}/secrets?branch=${selectedBranch}`,
        {
          auth: {
            username: cliId as string,
            password: cliToken as string,
          },
        },
      );

      const data = response.data as SecretResponse;

      loader.stop(
        `Fetched ${data.encryptedSecrets.length} secrets for branch: ${selectedBranch}`,
      );

      if (data.encryptedSecrets.length > 0) {
        const decryptedProjectKey = await decryptProjectKey(
          data.encryptedProjectKey,
        );

        loader.start(`Decrypting ${data.encryptedSecrets.length} secrets`);

        const decryptedSecrets = await decryptSecrets(
          data.encryptedSecrets,
          decryptedProjectKey,
        );

        loader.stop(
          `Decrypted ${data.encryptedSecrets.length} secrets for branch: ${selectedBranch}`,
        );

        ux.table(decryptedSecrets as never, {
          key: {
            header: "Key",
          },
          value: {
            header: "Value",
          },
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        loader.stop(`${red(err.response?.data?.message)}`);
      }
      triggerCancel();
    }
  }

  public async run(): Promise<void> {
    const version = this.config.version;
    const { flags } = await this.parse(Secrets);
    this.log(`Envless CLI ${grey(`${version}`)}`);

    await this.getSecrets(flags.branch || "");
    triggerCancel();
  }
}
