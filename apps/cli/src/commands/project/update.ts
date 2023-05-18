import { isCancel, outro, select, spinner, text } from "@clack/prompts";
import { Command, Flags } from "@oclif/core";
import axios from "axios";
import { blue, bold, cyan, red } from "kleur/colors";
import {
  API_VERSION,
  LINKS,
  getCliConfig,
  triggerCancel,
} from "../../lib/helpers";

interface ProjectDataType {
  id: string;
  name: string;
}

const loader = spinner();
export default class ProjectUpdate extends Command {
  static description = "describe the command here";

  static examples = [
    `
    envless project update
    envless project update -n="XXX" -i="xxx" -t
    envless project update -n="XXX" -i="xxx"
    envless project update --name="XXX" --projectId="xxx"
    envless project update --name="XXX" --projectId="xxx" --twoFactorRequired
      `,
  ];

  static flags = {
    // name of project // flag with a value (-n, --name=VALUE)
    name: Flags.string({
      description: `This is the project's name`,
      char: "n",
    }),
    // name of project // flag with a value (-n, --name=VALUE)
    projectId: Flags.string({
      description: `This is the project's id`,
      char: "i",
    }),
    // When twoFactorRequired is true, all team members should enable their two-factor authentication to access this project.
    twoFactorRequired: Flags.boolean({
      description: `When twoFactorRequired is true, all team members should enable their two-factor authentication to access this project.`,
      char: "t",
      dependsOn: ["name"],
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(ProjectUpdate);

    let allProjects: ProjectDataType[] = [];

    const config = await getCliConfig();

    if (!flags.name || !flags.projectId) {
      if (!flags.projectId && !flags.name) {
        await loader.start(`Fetching projects...`);

        if (!config.cliId || !config.cliToken) {
          loader.stop(
            `Please initialize the Envless CLI first by running ${bold(
              cyan(`envless init`),
            )}`,
          );
          return;
        }

        try {
          const { data: projects } = await axios.get(
            `${LINKS.api}/cli/${API_VERSION}/projects`,
            {
              auth: {
                username: config.cliId as string,
                password: config.cliToken as string,
              },
            },
          );

          if (Array.isArray(projects)) {
            allProjects = projects;
          }
          loader.stop(`Successfully fetched projects`);

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
          loader.stop(`Unauthorized error while fetching the projects`);
          triggerCancel();
          return;
        }
      }

      const newProjectName: any = await text({
        message: `Enter new project name:`,
        validate: (input: string) => {
          if (!input || input.trim() === "" || input.trim().length < 3) {
            return `Please enter a valid Project name`;
          }
        },
      });

      if (!newProjectName) {
        loader.stop(red(`Enter a new project name to proceed`));
        triggerCancel();
      }

      if (!allProjects.length) {
        loader.stop(red(`This project does not exist in your envless account`));
        triggerCancel();
      }

      const projectToUpdate = allProjects.find(
        (item) => item?.name === flags.name || item?.id === flags.projectId,
      );

      if (projectToUpdate) {
        const requestData = {
          ...projectToUpdate,
          twoFactorRequired: flags.twoFactorRequired || false,
          newName: newProjectName,
        };

        try {
          const response = await axios.post(
            `${LINKS.api}/cli/${API_VERSION}/projects/update`,
            requestData,
            {
              auth: {
                username: config.cliId as string,
                password: config.cliToken as string,
              },
            },
          );

          const data = response.data;
          await loader.stop(`🎉 Project updated successfully`);
          outro(blue(`${requestData.name} changed to ${newProjectName}`));
        } catch (err: any) {
          if (!!err) {
            if (err?.response?.data) loader.stop(err?.response?.data);
          }
          outro(red(`Project could not be updated`));
          triggerCancel();
        }
      }
    }
  }
}
