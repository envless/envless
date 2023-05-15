import type { NextApiResponse } from "next";
import withCliAuth, { type NextCliApiRequest } from "@/utils/withCliAuth";
import prisma from "@/lib/prisma";

const setSecrets = async (req: NextCliApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id, branch } = req.query;
    const { user } = req;
    const { secrets } = req.body;

    const projectAccess = await prisma.access.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: id as string,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!projectAccess) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (projectAccess.status !== "active") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const branchRecord = await prisma.branch.findUnique({
      where: {
        name_projectId: {
          name: branch as string,
          projectId: id as string,
        },
      },
    });

    if (!branchRecord) {
      return res.status(400).json({
        message: `Branch: ${branch} does not exist in this project`,
      });
    }

    let secretsUpdateCount = 0;
    let secretsInsertCount = 0;

    if (secrets.length > 0) {
      for (let secret of secrets) {
        const secretFromDb = await prisma.secret.findUnique({
          where: {
            uuid: secret.uuid,
          },
        });

        if (secretFromDb) {
          const data = {
            encryptedKey: secret.encryptedKey,
            encryptedValue: secret.encryptedValue,
            branchId: branchRecord.id,
          } as {
            uuid: string;
            branchId: string;
            encryptedKey: string;
            encryptedValue: string;
          };

          await prisma.secret.update({
            data,
            where: {
              id: secretFromDb.id,
            },
          });

          await prisma.secretVersion.create({
            data: {
              encryptedKey: secretFromDb?.encryptedKey as string,
              encryptedValue: secretFromDb?.encryptedValue as string,
              secretId: secretFromDb?.id as string,
            },
          });

          secretsUpdateCount++;
        } else {
          await prisma.secret.create({
            data: {
              uuid: secret.uuid,
              encryptedKey: secret.encryptedKey,
              encryptedValue: secret.encryptedValue,
              userId: user.id,
              branchId: branchRecord.id,
            },
          });

          secretsInsertCount++;
        }
      }
    }

    return res.status(200).json({
      secretsInsertCount,
      secretsUpdateCount,
    });
  }
};

export default withCliAuth(setSecrets);
