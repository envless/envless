import { PrismaClient } from "@prisma/client";
import colors from "colors";
import seedAccesses from "./seeds/access";
import seedBranches from "./seeds/branches";
import seedE2EESetup from "./seeds/e2eeSetup";
import seedInactiveUsers from "./seeds/inactiveUsers";
import seedInvites from "./seeds/invites";
import seedProjects from "./seeds/projects";
import seedPullRequests from "./seeds/pullRequests";
import seedSecrets from "./seeds/secrets";
import seedUsers from "./seeds/users";

const { Confirm } = require("enquirer");

const prisma = new PrismaClient();

colors.enable();

if (process.env.NODE_ENV === "production") {
  console.log("❌ You cannot run this command on production".red);
  process.exit(0);
}

const seed = async () => {
  // const prompt = new Confirm({
  //   name: "question",
  //   message:
  //     "⚠️  You are about to delete all the records on your database, and re-seed with new records, do you want to continue?"
  //       .yellow,
  // });

  // const answer = await prompt.run();
  const answer = true;

  if (answer) {
    await nuke();

    console.log("Seeding database".underline.cyan);
    return prisma.$transaction(async () => {
      await seedUsers(10);
      await seedProjects(5);
      // await seedAccesses();
      await seedE2EESetup();
      await seedBranches();
      await seedInactiveUsers(5);
      await seedInvites(5);
      // await seedPullRequests();
      await seedSecrets();
    });
  } else {
    throw new Error("Seeding aborted");
  }
};

const nuke = async () => {
  console.log("🚀 Nuking database records".yellow);
  return prisma.$transaction(async (prisma) => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.access.deleteMany();
    await prisma.branch.deleteMany();
    await prisma.projectInvite.deleteMany();
    await prisma.pullRequest.deleteMany();
    await prisma.userPublicKey.deleteMany();
    await prisma.encryptedProjectKey.deleteMany();
    await prisma.secret.deleteMany();
  });
};

seed()
  .then(async () => {
    console.log("✅ Database seeding completed".green);
    console.log("💌 Please login using envless@example.com".cyan);
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(`❌ ${e.message}`.red);
    await prisma.$disconnect();
  });
