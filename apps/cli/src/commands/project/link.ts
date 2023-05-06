import { intro, isCancel, outro, select, spinner } from "@clack/prompts";
import { Command, Flags } from "@oclif/core";
import axios from "axios";
import { bold, cyan, grey } from "kleur/colors";
import { writeToDotEnvless } from "../../lib/dotEnvless";
import { triggerCancel } from "../../lib/helpers";
import { LINKS } from "../../lib/helpers";
import { getCliConfigFromKeyStore } from "../../lib/keyStore";

const loader = spinner();

export default class LinkProject extends Command {
  static description = `Link your development project to the Envless project.\n${grey(
    `⚡ Please make sure you are running this command from your development project's root directory and have created a project. If you haven't, create one at \n${cyan(
      LINKS.projects,
    )}`,
  )}`;

  static flags = {
    projectId: Flags.string({
      char: "p",
      description: "Envless Project ID",
    }),

    branch: Flags.string({
      char: "b",
      description: "Envless project's branch name",
      default: "development",
    }),

    help: Flags.help({
      char: "h",
      description: "Show help for the link command",
    }),
  };

  static examples = [
    `
      $ envless project link
      $ envless project link --projectId xxxxxxxx
      $ envless project link --projectId xxxxxxxx --branch development
    `,
  ];

  async run(): Promise<void> {
    const version = this.config.version;
    const { flags } = await this.parse(LinkProject);
    flags.projectId ||= process.env.ENVLESS_PROJECT_ID as string;
    flags.branch ||= process.env.ENVLESS_BRANCH as string;

    this.log(`Envless CLI ${grey(`${version}`)}`);

    intro(`${bold(cyan(`Linking your project to Envless`))}`);

    if (!flags.projectId) {
      await loader.start(`Fetching projects...`);
      const config = await getCliConfigFromKeyStore();

      const cliId = process.env.ENVLESS_CLI_ID || config?.id;
      const cliToken = process.env.ENVLESS_CLI_TOKEN || config?.token;

      if (!cliId || !cliToken) {
        await loader.stop(
          `Please initialize the Envless CLI first by running ${bold(
            cyan(`envless init`),
          )}`,
        );
        return;
      }

      try {
        const { data: projects } = await axios.get(
          `${LINKS.api}/cli/v0/projects`,
          {
            auth: {
              username: cliId as string,
              password: cliToken as string,
            },
          },
        );

        await loader.stop(`Successfully fetched projects`);

        const response: any = await select({
          message: "Select a project",
          options: projects.map((project: any) => ({
            value: project.id,
            label: project.name,
          })),
        });

        isCancel(response) && triggerCancel();
        flags.projectId = response;
      } catch (error) {
        await loader.stop(`Unauthorized error while fetching the projects`);
        triggerCancel();
      }
    }

    const config = {
      name: "envless",
      version,
      projectId: flags.projectId,
      branch: flags.branch,
    };

    await writeToDotEnvless(config);
    outro(`🎉 ${bold(cyan(`Successfully linked project with config:`))}`);
    console.log(config);
  }
}
