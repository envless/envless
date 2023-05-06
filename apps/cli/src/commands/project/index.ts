import { Command } from "@oclif/core";
import { bold, cyan } from "kleur/colors";

export default class Project extends Command {
  static description = `Commands to perform project related actions. Available actions are: link, create and update`;

  static examples = [
    `
      $ envless project link
      $ envless project create
      $ envless project update
    `,
  ];

  async run(): Promise<void> {
    this.log(
      `Please run ${bold(
        cyan(`envless project --help`),
      )} to see available commands`,
    );
  }
}
