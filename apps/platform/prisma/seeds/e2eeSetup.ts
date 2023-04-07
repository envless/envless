import { generateKey } from "@47ng/cloak";
import { PrismaClient } from "@prisma/client";
import colors from "colors";
import fs from "fs";
import OpenPGP from "../../lib/encryption/openpgp";

const prisma = new PrismaClient();
const decryptedProjectKey = generateKey();

colors.enable();

const e2eeSetup = async () => {
  const email = "envless@example.com";
  console.log(
    `Setting up E2EE for ${email} with decryptedProjectKey ${decryptedProjectKey}`
      .blue,
  );

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      access: {
        select: {
          projectId: true,
        },
      },
    },
  });

  if (user) {
    const userPGP = await OpenPGP.generageKeyPair(user.name || "", user.email);
    const { publicKey, privateKey } = userPGP;

    await prisma.userPublicKey.create({
      data: {
        key: publicKey,
        userId: user.id,
      },
    });

    user.access.forEach(async (access) => {
      // const decryptedProjectKey = await generateKey();
      const encryptedProjectKey = await OpenPGP.encrypt(decryptedProjectKey, [
        publicKey,
      ]);

      await prisma.encryptedProjectKey.create({
        data: {
          encryptedKey: encryptedProjectKey as string,
          projectId: access.projectId,
        },
      });
    });

    fs.writeFileSync(`.envless.key`, privateKey);
    console.log(
      `🎉 E2EE setup for user with email ${email} is complete, please use envless.key on .envless.key when asked.`
        .green,
    );
  } else {
    console.log("❌ User doesn't exist".red);
    process.exit(0);
  }

  return true;
};

export default e2eeSetup;
