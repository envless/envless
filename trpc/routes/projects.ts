import { createRouter, withAuth } from "@/trpc/router";
import { Project } from "@prisma/client";
import { z } from "zod";
import Audit from "@/lib/audit";

export const projects = createRouter({
  getAll: withAuth.query(({ ctx }) => {
    // return ctx.prisma.projects.findMany();
    return [];
  }),

  getOne: withAuth.input(z.object({ id: z.number() })).query(({ input }) => {
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
          action: "project.created",
        });

        // @ts-ignore
        const access = newProject.access[0];
        // @ts-ignore
        const branch = newProject.branches[0];

        await Audit.create({
          createdById: user.id,
          createdForId: user.id,
          projectId: newProject.id,
          action: "access.created",
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
          action: "branch.created",
          data: {
            branch: {
              id: branch.id,
              name: branch.name,
            },
          },
        });

        await prisma.projectSetting.create({
          data: {
            projectId: newProject.id,
          },
        });
      }

      return newProject;
    }),
  update: withAuth
    .input(
      z.object({
        project: z.object({
          name: z.string(),
          id: z.string(),
          enforce_2fa_for_all_users: z.boolean(),
          projectSettingId: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { project } = input;

      const updatedProduct = await prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          name: project.name,
        },
      });
      await prisma.projectSetting.update({
        where: {
          id: project.projectSettingId,
        },
        data: {
          enforce_2fa_for_all_users: project.enforce_2fa_for_all_users,
        },
      });
      return updatedProduct;
    }),

  delete: withAuth
    .input(
      z.object({
        project: z.object({ name: z.string(), id: z.string() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { project } = input;

      const deletedProject = await prisma.project.delete({
        where: {
          id: project.id,
        },
      });
      return deletedProject;
    }),
});
