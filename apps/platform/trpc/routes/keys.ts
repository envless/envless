import { createRouter, withAuth } from "@/trpc/router";
import { z } from "zod";

export const keys = createRouter({
  create: withAuth
    .input(
      z.object({
        personal: z.object({
          publicKey: z.string().trim(),
        }),

        project: z.object({
          id: z.string().trim(),
          encryptedKey: z.string().trim(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { personal, project } = input;
      const publicKey = await prisma.userPublicKey.create({
        data: {
          userId: user.id,
          key: personal.publicKey,
        },
      });

      const projectKey = await prisma.encryptedProjectKey.create({
        data: {
          projectId: project.id,
          encryptedKey: project.encryptedKey,
        },
      });

      return {
        publicKey,
        projectKey,
      };
    }),
});
