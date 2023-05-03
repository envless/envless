import { createRouter, withAuth } from "@/trpc/router";
import { z } from "zod";

export const secrets = createRouter({
  getSecretesByBranchId: withAuth
    .input(
      z.object({
        branchId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { branchId } = input;
      const { user } = ctx.session;

      const branch = await ctx.prisma.branch.findUnique({
        where: {
          id: branchId,
        },

        select: {
          id: true,
          name: true,
          project: {
            select: {
              id: true,
              name: true,
              encryptedProjectKey: {
                select: {
                  encryptedKey: true,
                },
              },
            },
          },
        },
      });

      const secrets = await ctx.prisma.secret.findMany({
        where: {
          branchId,
          userId: user.id,
        },
        select: {
          id: true,
          uuid: true,
          encryptedKey: true,
          encryptedValue: true,
        },
      });

      return {
        branch,
        secrets,
      };
    }),
  saveSecrets: withAuth
    .input(
      z.object({
        secrets: z.array(
          z.object({
            uuid: z.string(),
            encryptedKey: z.string().min(1),
            encryptedValue: z.string().min(1),
            branchId: z.string().min(1),
            hasKeyChanged: z.boolean(),
            hasValueChanged: z.boolean(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { secrets } = input;

      let secretsUpdateCount = 0;
      let secretsInsertCount = 0;

      try {
        for (let secret of secrets) {
          const secretFromDb = await prisma.secret.findUnique({
            where: {
              uuid: secret.uuid,
            },
          });

          if (secretFromDb) {
            if (secret.hasKeyChanged || secret.hasValueChanged) {
              const data = {
                branchId: secret?.branchId,
              } as {
                uuid: string;
                branchId: string;
                encryptedKey: string;
                encryptedValue: string;
              };

              if (secret.hasKeyChanged) {
                data.encryptedKey = secret.encryptedKey;
              }

              if (secret.hasValueChanged) {
                data.encryptedValue = secret.encryptedValue;
              }

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
            }
          } else {
            await prisma.secret.create({
              data: {
                uuid: secret.uuid,
                encryptedKey: secret.encryptedKey,
                encryptedValue: secret.encryptedValue,
                userId: user.id,
                branchId: secret.branchId,
              },
            });

            secretsInsertCount++;
          }
        }
      } catch (err) {}

      return {
        secretsInsertCount,
        secretsUpdateCount,
      };
    }),
});