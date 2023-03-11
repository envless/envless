import { createRouter, withAuth } from "@/trpc/router";
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
  checkSlugAvailability: withAuth
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { slug } = input;
      const exists = await ctx.prisma.project.findFirst({
        where: {
          slug,
        },
      });
      if (exists) {
        return false;
      }
      return true;
    }),
  create: withAuth
    .input(
      z.object({
        project: z.object({ name: z.string(), slug: z.string() }),
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

      const updatedProduct = await prisma.project.update({
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
