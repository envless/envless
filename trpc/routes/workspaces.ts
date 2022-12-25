import { z } from "zod";
import { createRouter, withAuth, withoutAuth } from "@/trpc/router";

export const workspaces = createRouter({
  getAll: withAuth.query(({ ctx }) => {
    // return ctx.prisma.workspaces.findMany();
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
        workspace: z.object({ name: z.string() }),
        project: z.object({ name: z.string() }),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { workspace, project } = input;

      const space = prisma.workspace.create({
        data: {
          name: workspace.name,
          members: {
            create: {
              // @ts-ignore
              userId: user.id,
            },
          },
          projects: {
            create: {
              name: project.name,
              branches: {
                create: {
                  name: "main",
                },
              },
            },
          },
        },
      });

      return space;
    }),
});
