import React from "react";
import MagicLink from "@/emails/MagicLink";
import { createRouter, withAuth } from "@/trpc/router";
import { createHash, randomBytes } from "crypto";
import sendMail from "emails";
import { z } from "zod";
import Audit from "@/lib/audit";

export const members = createRouter({
  getActiveMembers: withAuth
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId } = input;
      const accesses = await ctx.prisma.access.findMany({
        where: {
          projectId: projectId,
        },
        include: {
          user: true,
        },
      });
      return accesses.map((access) => {
        return {
          id: access.user.id,
          name: access.user.name,
          email: access.user.email,
          image: access.user.image,
          twoFactorEnabled: access.user.twoFactorEnabled,
          role: access.role,
        };
      });
    }),
});
