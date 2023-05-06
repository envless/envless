import { text } from "@clack/prompts";
import { Command, Flags } from "@oclif/core";

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
    // Project's slug
    slug: Flags.string({
      description: `This is the project's slug`,
      char: "s",
      dependsOn: ["name"],
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(ProjectUpdate);

    // if slug and name are provided in flag
    if (flags.name && flags.slug) {
    }

    const projectName: any =
      flags.name ||
      (await text({
        message: `Enter project name:`,
        validate: (input: string) => {
          if (!input || input.trim() === "" || input.trim().length < 3) {
            return `Please enter a valid Project name`;
          }
        },
      }));
  }
}
