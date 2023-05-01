import { intro, isCancel, outro, text } from "@clack/prompts";
import { Command, Flags } from "@oclif/core";
import { bold, cyan, grey } from "kleur/colors";
import { triggerCancel } from "../lib/helpers";
import { LINKS } from "../lib/helpers";
import { saveCliConfigToKeyStore } from "../lib/keyStore";

export default class Init extends Command {
  static description = `Initialize Envless CLI \n${grey(
    `⚡ Please make sure you have created a project and setup CLI id and token on the dashboard. If you do not have a project, create one at \n${cyan(
      LINKS.login,
    )}`,
  )}`;

  static flags = {
    id: Flags.string({
      char: "i",
      description: "Unique identifier for CLI",
    }),
    token: Flags.string({
      char: "t",
      description: "Unique CLI token for authentication",
    }),
    help: Flags.help({
      char: "h",
      description: "Show help for the init command",
    }),
  };

  static examples = [
    `
      $ envless init
      $ envless init --id xxxxxxxx --token xxxxxxxx
    `,
  ];

  async run(): Promise<void> {
    const version = this.config.version;
    const { flags } = await this.parse(Init);
    flags.id ||= process.env.ENVLESS_CLI_ID;
    flags.token ||= process.env.ENVLESS_CLI_TOKEN;
    this.log(`Envless CLI ${grey(`${version}`)}`);

    intro(`${bold(cyan(`Initializing Envless CLI ...`))}`);

    if (!flags.id) {
      const id: any = await text({
        message: `Enter your CLI ID: ${grey(
          `If you do not have a project, create one at ${LINKS.login}`,
        )}`,

        validate: (input: string) => {
          if (input.trim().length != 25) {
            return `Please enter your CLI ID`;
          }
        },
      });

      flags.id = id;
      isCancel(id) && triggerCancel("Operation cancelled");
    }

    if (!flags.token) {
      const token: any = await text({
        message: `Enter your CLI TOKEN: ${grey(
          `Please follow this instruction to get your token: ${LINKS.docs}/quickstart#install-and-setup-envless-cli`,
        )}`,

        validate: (input: string) => {
          if (input.trim().length != 64) {
            return `Please enter your CLI token`;
          }
        },
      });

      flags.token = token;
      isCancel(token) && triggerCancel("Operation cancelled");
    }

    const cli = {
      id: flags.id,
      token: flags.token,
    };

    await saveCliConfigToKeyStore(cli);
    outro(`🎉 ${bold(cyan(`Successfully initialized!`))}`);
  }
}
