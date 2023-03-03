import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { AccessType } from "./types"
import { sample } from 'lodash'

import colors from 'colors';
colors.enable();

const createAccess = async () => {
  const accesses: AccessType[] = []
  const users = await prisma.user.findMany({
    select: { id: true }
  })

  const projects = await prisma.project.findMany({
    select: { id: true }
  })

  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < projects.length; j++) {
      accesses.push({
        userId: users[i].id as string,
        projectId: projects[j].id as string,
        role: sample(['owner', 'mentainer', 'developer', 'guest']) as AccessType['role']
      })
    }
  }

  console.log(`Seeding ${accesses.length} accesses`.blue);

  const records = await prisma.access.createMany({
    data: accesses,
  })

  console.log(`🎉 Seeded ${records.count} accesses`.green);
  return records;
}

export default createAccess;
