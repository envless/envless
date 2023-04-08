import { encryptString } from "@47ng/cloak";
import { PrismaClient } from "@prisma/client";
import colors from "colors";
import fs from "fs";
import OpenPGP from "../../lib/encryption/openpgp";
import { SecretType } from "./types";

const prisma = new PrismaClient();

colors.enable();

const seedSecrets = async (count: number = 10) => {
  const pgpPrivateKey = fs.readFileSync(".envless.key", "utf-8");

  if (!pgpPrivateKey) {
    throw new Error("No private key found");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: "envless@example.com",
    },
  });

  if (!user) {
    throw new Error("No user found");
  }

  const access = await prisma.access.findMany({
    where: {
      userId: user.id,
    },
  });

  if (!access) {
    throw new Error("Project access found");
  }

  const projects = await prisma.project.findMany({
    where: {
      id: {
        in: access.map((a) => a.projectId),
      },
    },

    include: {
      branches: true,
      encryptedProjectKey: true,
    },
  });

  if (!projects) {
    throw new Error("No projects found");
  }

  const secrets: SecretType[] = [];

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const { encryptedProjectKey } = project;

    if (!encryptedProjectKey) {
      continue;
    }

    const decryptedProjectkey = (await OpenPGP.decrypt(
      encryptedProjectKey.encryptedKey,
      pgpPrivateKey,
    )) as string;

    for (let j = 0; j < project.branches.length; j++) {
      const branch = project.branches[j];

      [
        { NODE_ENV: "development" },
        { REDIS_URL: "redis://localhost:6379" },
        { AWS_CLIENT_ID: "1234567890" },
        { AWS_SECRET: "1234567890ABVCDEFGHIJLKMNOP" },
        {
          PGP_PRIVATE_KEY: `-----BEGIN PGP PRIVATE KEY BLOCK-----

xVgEZC0XiBYJKwYBBAHaRw8BAQdAw/ZulJBmqj38rrDHjyxLcWbMSHRlgqb0
oobhhgkQU0kAAQDAw25L6hSqZPfwFDrhwcuqBHE10l7+VK+elN0ZLw4LYRBB
zRU8YW5vdGhlckBleGFtcGxlLmNvbT7CjAQQFgoAPgWCZC0XiAQLCQcICZBO
l7M4ro537wMVCAoEFgACAQIZAQKbAwIeARYhBEy5+J9FSrMfyWitAU6Xsziu
jnfvAADxBgEArFv/Ck6nXrxckRG9HOcLUpwLXnvwN/R88ZaNWDBdECwA/2GT
m7XeUMWNCptQvSWSh1z4KH0N7UF1dAWeG4JMiRMPx10EZC0XiBIKKwYBBAGX
VQEFAQEHQBxwzCjiLv9k2AOGn3+N1RI85q84Hm6sANeISFmIWuA5AwEIBwAA
/2HSifX4/4U63PhmeUxmya1YML46sd2+Nh5Y2/9LbnS4E3jCeAQYFggAKgWC
ZC0XiAmQTpezOK6Od+8CmwwWIQRMufifRUqzH8lorQFOl7M4ro537wAAvbEB
APnafcefK0sxxMGX8DgH6YZVo84gpni0cbfcYE/eBoepAP0bmWyhU9AbOweE
buhTszr/M+Wq+8fQ1JvixHjZScE1CQ==
=SavZ
-----END PGP PRIVATE KEY BLOCK-----
        `,
        },
      ].forEach(async (keypair) => {
        const keyPairObj = Object.keys(keypair);
        const key = keyPairObj[0];
        const value = keypair[key];

        const encryptedKey = await encryptString(key, decryptedProjectkey);
        const encryptedValue = await encryptString(value, decryptedProjectkey);

        secrets.push({
          branchId: branch.id,
          encryptedKey,
          encryptedValue,
          userId: user.id,
        } as SecretType);
      });
    }
  }

  console.log(`Seeding ${secrets.length} ENV variables`.blue);
  const records = await prisma.secret.createMany({
    data: secrets,
  });

  console.log(`🎉 Seeded ${records.count} ENV variables`.green);
  return records;
};

export default seedSecrets;
