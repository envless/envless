import { encryptString } from "@47ng/cloak";
import { outro, spinner } from "@clack/prompts";
import { Args, Command, Flags } from "@oclif/core";
import axios from "axios";
import { randomUUID } from "crypto";
import { bold, cyan, green, grey, red } from "kleur/colors";
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
  uuid?: string;
  encryptedKey: string;
  encryptedValue: string;
};

type SecretResponse = {
  encryptedSecrets: EncryptedSecret[];
  encryptedProjectKey: string;
};

type SecretSaveResponse = {
  secretsInsertCount: number;
  secretsUpdateCount: number;
};

export default class SetSecrets extends Command {
  protected decryptedProjectKey: string = "";
  protected cliId: string = "";
  protected cliToken: string = "";
  protected projectId: string = "";
  protected branch: string = "";
  static description = `Get All the remote secrets for the current branch`;

  static strict = false;

  static examples = [
    `
      $ envless secrets set NODE_ENV=development
      $ envless secrets get NODE_ENV=development REDIS_URL=https://localhost:6379
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

  static args = {
    secrets: Args.string({
      name: "args",
      description: `Provide secret/s, Eg: NODE_ENV=development REDIS_URL=http://localhost:6379`,
    }),
  };

  public async init(): Promise<void> {
    await super.init();

    const config = await getCliConfigFromKeyStore();
    const envless = await readFromDotEnvless();

    const { projectId, branch: branchFromKeyStore } = envless;

    this.cliId = process.env.ENVLESS_CLI_ID || config?.id;
    this.cliToken = process.env.ENVLESS_CLI_TOKEN || config?.token;
    this.projectId = projectId;
    this.branch = branchFromKeyStore;
  }

  private async getSecrets(branch: string) {
    loader.start(`Fetching secrets for branch: ${branch}`);

    if (!this.cliId || !this.cliToken) {
      loader.stop(
        `Please initialize the Envless CLI first by running ${bold(
          cyan(`envless init`),
        )}`,
      );
      return;
    }

    try {
      const response = await axios.get(
        `${LINKS.api}/cli/${API_VERSION}/projects/${this.projectId}/secrets?branch=${branch}`,
        {
          auth: {
            username: this.cliId as string,
            password: this.cliToken as string,
          },
        },
      );

      const data = response.data as SecretResponse;

      loader.stop(
        `Fetched ${data.encryptedSecrets.length} secrets for branch: ${branch}`,
      );

      if (data.encryptedSecrets.length > 0) {
        this.decryptedProjectKey = await decryptProjectKey(
          data.encryptedProjectKey,
        );

        loader.start(`Decrypting ${data.encryptedSecrets.length} secrets`);

        const decryptedSecrets = await decryptSecrets(
          data.encryptedSecrets,
          this.decryptedProjectKey,
        );

        loader.stop(
          `Decrypted ${data.encryptedSecrets.length} secrets for branch: ${branch}`,
        );
        return decryptedSecrets;
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
    const { flags, argv } = await this.parse(SetSecrets);
    this.log(`Envless CLI ${grey(`${version}`)}`);

    const selectedBranch = flags.branch || this.branch;

    const decryptedSecrets = await this.getSecrets(selectedBranch || "");

    const secretsInput = (argv as string[]).map((arg) => {
      const secretPair = arg.split("=");
      const key = secretPair[0];
      const value = secretPair[1];

      return { key, value };
    });

    const secretsToSave: any = [];

    if (decryptedSecrets && decryptedSecrets.length > 0) {
      for (const input of secretsInput) {
        const secret = decryptedSecrets.find((s: any) => s.key === input.key);
        const key = await encryptString(input.key, this.decryptedProjectKey);
        const value = await encryptString(
          input.value,
          this.decryptedProjectKey,
        );
        if (secret) {
          secretsToSave.push({
            id: secret.id,
            encryptedKey: key,
            encryptedValue: value,
            uuid: secret.uuid,
          });
        } else {
          secretsToSave.push({
            encryptedKey: key,
            encryptedValue: value,
            uuid: randomUUID(),
          });
        }
      }
    } else {
      for (const input of secretsInput) {
        const key = await encryptString(input.key, this.decryptedProjectKey);
        const value = await encryptString(
          input.value,
          this.decryptedProjectKey,
        );
        secretsToSave.push({
          encryptedKey: key,
          encryptedValue: value,
          uuid: randomUUID(),
        });
      }
    }

    try {
      const credentials = Buffer.from(
        `${this.cliId}:${this.cliToken}`,
      ).toString("base64");
      const headers = {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        `${LINKS.api}/cli/${API_VERSION}/projects/${this.projectId}/secrets/set?branch=${selectedBranch}`,
        {
          secrets: secretsToSave,
        },
        { headers },
      );

      const data = response.data as SecretSaveResponse;

      outro(
        `${green(bold("✓"))} ${data.secretsInsertCount} new secrets added and ${
          data.secretsUpdateCount
        } secrets are updated.`,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        loader.stop(`${red(error.response?.data?.message)}`);
      }
    }

    triggerCancel();
  }
}
