import { intro, isCancel, outro, select, spinner, text } from "@clack/prompts";
import { Args, Command, Flags } from "@oclif/core";
import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import { blue, bold, cyan, grey, red, underline } from "kleur/colors";
import { triggerCancel } from "../../lib/helpers";
import { getCliConfigFromKeyStore } from "../../lib/keyStore";

type NewProjectResponse = {
  name: string;
  slug: string;
  createdAt: Date;
};

type ErrorMessage = {
  message: string;
};

const loader = spinner();
const API_BASE = process.env.API_BASE || `http://localhost:3000`;
const LINKS = {
  projectsPage: `${API_BASE}/projects`,
  documentation: `${API_BASE}/docs/cli/projects`,
  projects: `${API_BASE}/cli/projects`,
};

export default class ProjectCreate extends Command {
  static description = `Create a new Envless project.\n${grey(
    `⚡ Please make sure you are running this command from your project's root directory and make sure you have completed your CLI setup. If not, please do so at \n${cyan(
      LINKS.projects,
    )}`,
  )}`;
  static examples = [
    `
      $ envless project create
      $ envless project create {project name}
      `,
  ];

  static flags = {
    name: Flags.string({
      description: `This is the project's name`,
      char: "n",
    }),
  };

  private async createProject(projectName: string) {
    await loader.start(
      `Creating your Envless project: ${bold(cyan(projectName))}...`,
    );
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
    await intro(`${bold(cyan(`Creating Envless project`))}`);
    try {
      const response = await axios.post(
        `${API_BASE}/api/cli/v0/projects`,
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

      const data = response.data as NewProjectResponse;
      await loader.stop(
        `🎉 Project created succcesfully ${bold(cyan(projectName))}`,
      );
      await outro(
        `Visit this link on your web browser: ${underline(
          blue(`${LINKS.projectsPage}/${data.slug}`),
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

      if (projectName) {
        this.createProject(projectName);
        return;
      }
    } else {
      if (flags.name) {
        this.createProject(flags.name);
        return;
      }
    }
    await outro(
      `Use the command ${cyan(
        "envless project create",
      )} to get prompt or ${cyan(
        `envless project create ${bold('--name "[PROJECT_NAME]"')}`,
      )} to create a project`,
    );
    triggerCancel();
  }
}
