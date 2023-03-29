// TODO: Complete auth implementation
import { intro, isCancel, outro, select, spinner, text } from "@clack/prompts";
import { Command, Flags, ux } from "@oclif/core";
import * as keytar from "keytar";
import { blue, bold, cyan, grey, underline, yellow } from "kleur/colors";
import { triggerCancel } from "../lib/helpers";
import { savePrivateKeyToKeyStore, saveToKeyStore } from "../lib/keyStore";

const API_BASE = process.env.API_BASE || `http://localhost:3000`;
const loader = spinner();
const LINKS = {
  login: `${API_BASE}/auth/login`,
  cliTokenDoc: `${API_BASE}/docs/cli/auth`,
  privateKeySetupDoc: `${API_BASE}/docs/cli/private-key`,
};

export default class Init extends Command {
  static description = `Initialize Envless CLI \n${grey(
    `Please make sure you have created a project and downloaded your Private Key before running this command.`,
  )}\n${yellow(
    `If you do not have a project, create one at ${cyan(LINKS.login)}`,
  )}`;

  static flags = {
    pid: Flags.string({
      char: "p",
      description: "Project ID",
    }),
    token: Flags.string({
      char: "t",
      description: "CLI auth Token",
    }),
    pkey: Flags.string({
      char: "k",
      description: "Your private key",
    }),
  };

  static examples = [
    `
      $ envless init
      $ envless init --pid xxxxxxxx --token xxxxxxxx
    `,
  ];

  async run(): Promise<void> {
    const version = this.config.version;
    const { flags } = await this.parse(Init);
    flags.pid = process.env.ENVLESS_PROJECT_ID;
    flags.token = process.env.ENVLESS_CLI_TOKEN;
    flags.pkey = process.env.ENVLESS_PRIVATE_KEY;

    await savePrivateKeyToKeyStore();
    process.env.TEST_TOKEN = "flags.token";

    await intro(`👋 ${bold(cyan(`Welcome to Envless ${grey(`${version}`)}`))}`);

    if (!flags.pid) {
      const pid: any = await text({
        message: `Enter your Project ID: ${grey(
          `If you do not have a project, create one at ${LINKS.login}`,
        )}`,
      });

      flags.pid = pid;
      isCancel(pid) && triggerCancel();
    }

    if (!flags.token) {
      const token: any = await text({
        message: `Enter your CLI TOKEN: ${grey(
          `Please follow this instruction to get your token: ${LINKS.cliTokenDoc}`,
        )}`,
      });

      flags.token = token;
      isCancel(token) && triggerCancel();
    }

    const key = {
      projectId: flags.pid,
      cliToken: flags.token,
    };

    await saveToKeyStore(key);
    await outro(`🎉 ${bold(cyan(`Successfully initialized Envless CLI`))}`);
  }
}
