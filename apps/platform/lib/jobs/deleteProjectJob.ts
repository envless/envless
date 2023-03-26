import { Job, PrismaTransaction } from "./baseJob";

export class DeleteProjectJob extends Job {
  constructor() {
    super();
  }

  async handle(tx: PrismaTransaction) {
    // get all the projects that has deletedAt past 7 days
    const projects = await tx.project.findMany({
      where: {
        deletedAt: {
          lte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    await tx.project.deleteMany({
      where: {
        id: {
          in: projects.map((project) => project.id),
        },
      },
    });
  }
}
