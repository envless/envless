import { createRouter, withAuth } from "@/trpc/router";
import { z } from "zod";
import Audit from "@/lib/audit";

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

      const newProject = await prisma.project.create({
        data: {
          name: project.name,
          access: {
            create: {
              userId: user.id,
              role: "owner",
            },
          },
          branches: {
            create: {
              name: "main",
              createdById: user.id,
            },
          },
        },

        include: {
          access: true,
          branches: true,
        },
      });

      if (newProject.id) {
        await Audit.create({
          createdById: user.id,
          projectId: newProject.id,
          action: "created.project",
        });

        // @ts-ignore
        const access = newProject.access[0];
        // @ts-ignore
        const branch = newProject.branches[0];

        await Audit.create({
          createdById: user.id,
          createdForId: user.id,
          projectId: newProject.id,
          action: "created.access",
          data: {
            access: {
              id: access.id,
              role: access.role,
            },
          },
        });

        await Audit.create({
          createdById: user.id,
          projectId: newProject.id,
          action: "created.branch",
          data: {
            branch: {
              id: branch.id,
              name: branch.name,
            },
          },
        });
      }

      return newProject;
    }),
});
