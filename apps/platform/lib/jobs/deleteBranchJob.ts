import { Job, PrismaTransaction } from "./baseJob";

export class DeleteBranchJob extends Job {
  constructor() {
    super();
  }

  async handle(tx: PrismaTransaction) {
    // Get all branches that have deletedAt within the past 24 hours.
    const branches = await tx.branch.findMany({
      where: {
        deletedAt: {
          lte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        },
      },
    });

    await tx.branch.deleteMany({
      where: {
        id: {
          in: branches.map((branch) => branch.id),
        },
      },
    });
  }
}
