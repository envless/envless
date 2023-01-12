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

        include: {
          roles: true,
          branches: true,
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

        // @ts-ignore
        const role = newProject.roles[0];
        // @ts-ignore
        const branch = newProject.branches[0];

        await Audit.create({
          userId,
          projectId: newProject.id,
          event: "created.role",
          data: {
            project: {
              id: newProject.id,
              name: newProject.name,
            },
            role: {
              id: role.id,
              name: role.name,
            },

            user: {
              id: userId,
              email: user.email,
            },
          },
        });

        await Audit.create({
          userId,
          projectId: newProject.id,
          event: "created.branch",
          data: {
            project: {
              id: newProject.id,
              name: newProject.name,
            },
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
