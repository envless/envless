import { isCancel, select, spinner, text } from "@clack/prompts";
import { Command, Flags } from "@oclif/core";
import axios from "axios";
import { bold, cyan, red } from "kleur/colors";
import {
  API_VERSION,
  LINKS,
  getCliConfig,
  triggerCancel,
} from "../../lib/helpers";
import { getCliConfigFromKeyStore } from "../../lib/keyStore";

const loader = spinner();
export default class ProjectUpdate extends Command {
  static description = "describe the command here";

  static examples = [
    `
    envless project update
    envless project update -n="XXX" -s="xxx"
    envless project update --name="XXX" --slug="xxx"
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

    // These are the
    if (!flags.name || !flags.projectId) {
      if (!flags.projectId && !flags.name) {
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
          return;
        }
      }

      const newProjectName: any =
        flags.name ||
        (await text({
          message: `Enter new project name:`,
          validate: (input: string) => {
            if (!input || input.trim() === "" || input.trim().length < 3) {
              return `Please enter a valid Project name`;
            }
          },
        }));

      if (!newProjectName) {
        loader.stop(red(`Enter a new project name to proceed`));
        triggerCancel();
      }

      const requestData = {
        name: flags.name,
        projectId: flags.projectId,
        twoFactorRequired: flags.twoFactorRequired,
      };
      const cliInfo = await getCliConfig();

      //     try{
      //       const response = await axios.post(`${LINKS.api}/cli/${API_VERSION}/projects/update`,{...requestData}, {
      //       auth:{
      //         username: cliInfo.cliId as string,
      //           password: cliInfo.cliToken as string,
      //       }
      //     })

      //     const data = response.data as;
      // }catch(e){

      // }
    }
  }
}
