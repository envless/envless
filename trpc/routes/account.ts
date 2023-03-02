import { createRouter, withAuth } from "@/trpc/router";
import { z } from "zod";
import Audit from "@/lib/audit";

export const account = createRouter({
  update: withAuth
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        marketing: z.boolean(),
        notification: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { name, email, marketing, notification } = input;
      const currentUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          name: true,
          email: true,
          marketing: true,
          notification: true,
        },
      });

      const updatedUser = prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name,
          email,
          marketing,
          notification,
        },

        select: {
          name: true,
          email: true,
          marketing: true,
          notification: true,
        },
      });

      // Create audit log only if there is a change
      if (
        name != currentUser?.name ||
        email != currentUser?.email ||
        marketing != currentUser?.marketing ||
        notification != currentUser?.notification
      ) {
        await Audit.create({
          createdById: user.id,
          createdForId: user.id,
          action: "account.updated",
          data: {
            before: {
              ...(name != currentUser?.name && { name: currentUser?.name }),
              ...(email != currentUser?.email && { email: currentUser?.email }),
              ...(marketing != currentUser?.marketing && {
                marketing: currentUser?.marketing,
              }),
              ...(notification != currentUser?.notification && {
                notification: currentUser?.notification,
              }),
            },
            after: {
              ...(name != currentUser?.name && { name }),
              ...(email != currentUser?.email && { email }),
              ...(marketing != currentUser?.marketing && { marketing }),
              ...(notification != currentUser?.notification && {
                notification,
              }),
            },
          },
        });
      }

      return updatedUser;
    }),
});
