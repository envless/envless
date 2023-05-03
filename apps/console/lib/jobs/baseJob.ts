import { Prisma, PrismaClient } from "@prisma/client";

export type PrismaTransaction = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

export class Job {
  constructor() {
    this.name = this._getName();
  }

  public name: string;

  /**
   * Example input DeleteProjectJob
   * Example output delete:project:job
   */
  private _getName(): string {
    return this.constructor.name
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .splice(1)
      .map((str) => str.toLowerCase())
      .join(":");
  }

  async run() {
    const prisma = new PrismaClient();

    try {
      console.log(
        `Running Job ${this.name} started at ${new Date().toLocaleString()} `,
      );

      prisma.$transaction(async (tx) => {
        await this.handle(tx);
        console.log(
          `Running Job ${this.name} ended at ${new Date().toLocaleString()} `,
        );
      });
    } catch (e) {
      console.error(`Error in Job ${this.name}`, e);
    } finally {
      prisma.$disconnect();
    }
  }

  async handle(tx: PrismaTransaction) {
    try {
      await this.run();
    } catch (e) {
      console.error(e);
    }
  }
}
