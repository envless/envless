const { Confirm } = require('enquirer');
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { UserType, ProjectType, AccessType } from "./seeds/types"

import colors from 'colors';
colors.enable();

import createUsers from "./seeds/users";
import createProjects from "./seeds/projects";
import createAccess from "./seeds/access";

const seed = async () => {
  const prompt = new Confirm({
    name: 'question',
    message: '⚠️  You are about to delete all the records on your database, and re-seed with new records, do you want to continue?'.yellow
  });
  
  const answer = await prompt.run();

  if (answer) {
    await nuke();

    console.log('Seeding database'.underline.cyan);
    return prisma.$transaction(async () => {
      await createUsers(100);
      await createProjects(50);
      await createAccess();
    })
  } else {
    throw new Error('Seeding aborted');
  }
}

const nuke = async () => {
  console.log('🚀 Nuking database records'.yellow);
  return prisma.$transaction(async (prisma) => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.access.deleteMany();
  })
}

seed()
  .then(async () => {
    console.log('✅ Database seeding completed'.green);
    console.log('💌 Please login using envless.dev@example.com'.cyan)
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(`❌ ${e.message}`.red);
    await prisma.$disconnect();
  })
