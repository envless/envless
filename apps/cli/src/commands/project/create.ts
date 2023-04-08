import { intro, isCancel, outro, select, spinner, text } from "@clack/prompts";
import { Args, Command, Flags } from "@oclif/core";
import axios, { AxiosResponse } from "axios";
import { blue, bold, cyan, grey, red, underline } from "kleur/colors";
import { triggerCancel } from "../../lib/helpers";
import { getCliConfigFromKeyStore } from "../../lib/keyStore";

type NewProjectResponse = {
  name: string;
  slug: string;
  createdAt: Date;
};

const loader = spinner();
const API_BASE = process.env.API_BASE || `http://localhost:3000`;
const LINKS = {
  projectsPage: `${API_BASE}/projects`,
  documentation: `${API_BASE}/docs/cli/projects`,
};

export default class ProjectCreate extends Command {
  static description =
    "Create a new project in the Envles. This command will create a new project with the specified name and add it to the list of projects in the Envless project. If no name is provided, You'll be prompted to provide one";

  static examples = [
    `
      $ envless project create
      $ envless project create {project name} {project slug}
      `,
  ];

  static args = {
    name: Args.string({
      description: `This is the project's name`,
      dependsOn: ["slug"],
    }),
    slug: Args.string({
      description: `This will be used as the slug for the project`,
      dependsOn: ["name"],
    }),
  };

  async createProject(projectName: string, projectSlug: string) {
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
        `${API_BASE}/api/cli/v0/projects/create`,
        {
          slug: projectSlug,
          name: projectName,
        },
        {
          auth: {
            username: cliId as string,
            password: cliToken as string,
          },
        },
      );

      if (response) {
        const data = response.data as NewProjectResponse;
        await loader.stop(
          `🎉 Project created succcesfully ${bold(cyan(projectName))}`,
        );
        await outro(
          `Visit this link on your web browser: ${underline(
            blue(`${LINKS.projectsPage}/${data.slug}`),
          )}`,
        );
      }
    } catch (e: any) {
      await outro(`${bold(red(`Project creation failed`))}`);
      throw new Error(e?.message || e);
    }
  }

  public async run(): Promise<void> {
    const version = this.config.version;
    const { args } = await this.parse(ProjectCreate);
    this.log(`Envless CLI ${grey(`${version}`)}`);

    if (!args.name || !args.slug) {
      const projectName: any = await text({
        message: `Enter project name:`,
        validate: (input: string) => {
          if (!input || input.trim() === "" || input.trim().length < 3) {
            return `Please enter a valid Project name`;
          }
        },
      });
      const projectSlug: any = await text({
        message: `Enter project slug:`,
        validate: (input: string) => {
          if (!input || input.trim() === "" || input.trim().length < 3) {
            return `Please enter a valid Project name`;
          }
        },
      });
      if (projectName && projectSlug) {
        this.createProject(projectName, projectSlug);
        return;
      }
    } else {
      if (args.name && args.slug) {
        this.createProject(args.name, args.slug);
        return;
      }
    }
    await outro(
      `Use the command ${cyan(
        "envless project create",
      )} to get prompt or ${cyan(
        `envless project create ${bold("[PROJECT_NAME] [PROJECT_SLUG]")}`,
      )} to create a project`,
    );
    triggerCancel();
  }
}
