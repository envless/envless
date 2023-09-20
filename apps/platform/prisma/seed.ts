import { PrismaClient } from "@prisma/client";
import colors from "colors";
import seedUsers from "./seeds/users";

const prisma = new PrismaClient();
colors.enable();

if (process.env.NODE_ENV === "production") {
  console.log("❌ You cannot run this command on production".red);
  process.exit(0);
}

const seed = async () => {
  const answer = true;

  if (answer) {
    await nuke();

    console.log("Seeding database".underline.cyan);
    return prisma.$transaction(async () => {
      // await seedUsers(10);
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
    await prisma.invite.deleteMany();
    await prisma.pullRequest.deleteMany();
    await prisma.keychain.deleteMany();
    await prisma.encryptedProjectKey.deleteMany();
    await prisma.secret.deleteMany();
    await prisma.secretVersion.deleteMany();
    await prisma.serviceAccount.deleteMany();
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
