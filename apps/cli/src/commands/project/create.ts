import { cancel, intro, isCancel, outro, spinner, text } from "@clack/prompts";
import { Command, Flags } from "@oclif/core";
import axios, { AxiosError } from "axios";
import { blue, bold, cyan, grey, red, underline } from "kleur/colors";
import { triggerCancel } from "../../lib/helpers";
import { API_VERSION, LINKS } from "../../lib/helpers";
import { getCliConfigFromKeyStore } from "../../lib/keyStore";

const loader = spinner();

type ProjectResponse = {
  name: string;
  slug: string;
  createdAt: Date;
};

export default class ProjectCreate extends Command {
  static description = `Create a new Envless project.\n${grey(
    `⚡ Please make sure you are running this command from your project's root directory and make sure you have completed your CLI setup. If not, please do so at envless platform.`,
  )}`;
  static examples = [
    `
      $ envless project create
      $ envless project create --name Project X
      `,
  ];

  static flags = {
    name: Flags.string({
      description: `This is the project's name`,
      char: "n",
    }),
  };

  private async createProject(projectName: string) {
    loader.start(
      `Creating your Envless project: ${bold(cyan(projectName))}...`,
    );
    const config = await getCliConfigFromKeyStore();

    const cliId = process.env.ENVLESS_CLI_ID || config?.id;
    const cliToken = process.env.ENVLESS_CLI_TOKEN || config?.token;

    if (!cliId || !cliToken) {
      loader.stop(
        `Please initialize the Envless CLI first by running ${bold(
          cyan(`envless init`),
        )}`,
      );
      return;
    }
    intro(`${bold(cyan(`Creating Envless project`))}`);
    try {
      const response = await axios.post(
        `${LINKS.api}/cli/${API_VERSION}/projects`,
        {
          name: projectName,
        },
        {
          auth: {
            username: cliId as string,
            password: cliToken as string,
          },
        },
      );

      const data = response.data as ProjectResponse;
      await loader.stop(
        `🎉 Project created succcesfully ${bold(cyan(projectName))}`,
      );
      outro(
        `Visit this link on your web browser: ${underline(
          blue(`${LINKS.projects}/${data.slug}`),
        )}`,
      );
    } catch (err: any) {
      const error = err as AxiosError;
      if (error.response?.status === 409) {
        loader.stop(
          red(`Project with name: ${bold(projectName)} already exists`),
        );
        triggerCancel();
        return;
      }
      loader.stop(`Unauthorized error while creating the project`);
      triggerCancel();
    }
  }

  public async run(): Promise<void> {
    const version = this.config.version;
    const { flags } = await this.parse(ProjectCreate);
    this.log(`Envless CLI ${grey(`${version}`)}`);

    if (!flags.name) {
      const projectName: any = await text({
        message: `Enter project name:`,
        validate: (input: string) => {
          if (!input || input.trim() === "" || input.trim().length < 3) {
            return `Please enter a valid Project name`;
          }
        },
      });

      isCancel(projectName) && triggerCancel();

      this.createProject(projectName);
      return;
    } else {
      if (flags.name) {
        this.createProject(flags.name);
        return;
      }
    }
    outro(
      `Use the command ${cyan(
        "envless project create",
      )} to get prompt or ${cyan(
        `envless project create ${bold('--name "[PROJECT_NAME]"')}`,
      )} to create a project`,
    );
    triggerCancel();
  }
}
