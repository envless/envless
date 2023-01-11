import { z } from "zod";
import Audit from "@/lib/audit";
import { createRouter, withAuth } from "@/trpc/router";

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
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { project } = input;
      // @ts-ignore
      const userId = user.id;

      const newProject = await prisma.project.create({
        data: {
          name: project.name,
          roles: {
            create: {
              userId: userId,
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

      if (newProject.id) {
        await Audit.create({
          userId,
          projectId: newProject.id,
          event: "created.project",
          data: {
            project: {
              id: newProject.id,
              name: newProject.name,
            },
          },
        });
      }

      return newProject;
    }),
});
