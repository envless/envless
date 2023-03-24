import { env } from "@/env/index.mjs";
import { createRouter, withAuth } from "@/trpc/router";
import sendMail from "emails";
import { string, z } from "zod";
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
  checkSlugOrNameAvailability: withAuth
    .input(
      z.object({
        slug: z.string().trim().optional(),
        name: string().trim().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { slug, name } = input;

      const existingProject = await ctx.prisma.project.findFirst({
        where: {
          OR: [
            {
              name,
            },
            { slug },
          ],
        },
      });

      if (existingProject) {
        const conflictField = existingProject.slug === slug ? "slug" : "name";
        return { conflictField };
      } else {
        return {};
      }
    }),

  create: withAuth
    .input(
      z.object({
        project: z.object({ name: z.string().trim(), slug: z.string().trim() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { project } = input;

      const newProject = await prisma.project.create({
        data: {
          name: project.name,
          slug: project.slug,
          access: {
            create: {
              userId: user.id,
              role: "owner",
            },
          },
          branches: {
            create: {
              name: "main",
              protected: true,
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
      }

      return newProject;
    }),
  update: withAuth
    .input(
      z.object({
        project: z.object({
          name: z.string(),
          id: z.string(),
          enforce2FA: z.boolean(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { project } = input;
      const enforce2FA = project.enforce2FA || false;

      const updatedProject = await prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          name: project.name,
          settings: {
            enforce2FA: project.enforce2FA,
          },
        },
      });

      return updatedProject;
    }),

  delete: withAuth
    .input(
      z.object({
        project: z.object({ id: z.string().min(1, "project id is required") }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { project } = input;
      const userId = ctx.session.user.id;

      const softDeletedProject = await prisma.project.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id: project.id,
        },
      });

      /*
       await sendMail({
        subject: `Your project ${softDeletedProject?.name} will be deleted`,
        to: 'test@test.com',
      });
     */

      await Audit.create({
        createdById: userId,
        projectId: softDeletedProject.id,
        action: "project.delete_requested",
        data: {
          project: {
            id: softDeletedProject.id,
            name: softDeletedProject.name,
          },
        },
      });

      return softDeletedProject;
    }),
});
