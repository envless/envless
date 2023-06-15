import useAccess from "@/hooks/useAccess";
import { createRouter, withAuth } from "@/trpc/router";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const projectKey = createRouter({
  update: withAuth
    .input(
      z.object({
        projectId: z.string(),
        encryptedKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { projectId, encryptedKey } = input;

      const hasAccess = await useAccess({
        userId: user.id,
        projectId,
      });

      if (!hasAccess) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You do not have the required permission to perform this action. Please contact the project owner to request permission.",
        });
      }

      await prisma.encryptedProjectKey.update({
        where: {
          projectId,
        },

        data: {
          encryptedKey,
        },
      });
    }),
});
