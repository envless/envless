import { z } from "zod";
import { createRouter, withAuth, withoutAuth } from "@/trpc/router";

export const projects = createRouter({
  getAll: withAuth.query(({ ctx }) => {
    // return ctx.prisma.projects.findMany();
    return [];
  }),

  getOne: withAuth
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      const { id } = input;

      return { id };
    }),

  create: withAuth
    .input(
      z.object({
        project: z.object({ name: z.string() }),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { project } = input;

      return prisma.project.create({
        data: {
          name: project.name,
          roles: {
            create: {
              // @ts-ignore
              userId: user.id,
              name: "owner",
            },
          },
          branches: {
            create: {
              name: "main",
            },
          },
        },
      });
    }),
});
