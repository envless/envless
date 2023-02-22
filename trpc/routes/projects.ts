import { createRouter, withAuth } from "@/trpc/router";
import { Project } from "@prisma/client";
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
        project: z.object({ name: z.string(), id: z.string() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { project } = input;

      const updatedProduct = await prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          name: project.name,
        },
      });

      const access = await prisma.access.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          project: {
            select: {
              id: true,
              name: true,
              updatedAt: true,
            },
          },
        },
      });

      const projects = access.map((a) => a.project) as Project[];
      const currentProject = projects.find(
        (p) => p.id === updatedProduct.id,
      ) as Project;
      return { projects, currentProject };
    }),

  delete: withAuth
    .input(
      z.object({
        project: z.object({ name: z.string(), id: z.string() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { user } = ctx.session;
      const { project } = input;

      const deletedProject = await prisma.project.delete({
        where: {
          id: project.id,
        },
      });

      /** @todo: audit log on some case **/

      // if(hello.id){
      //   await Audit.create({
      //     createdById: user.id,
      //     projectId: hello.id,
      //     action: "created.branch",
      //     data: {
      //       branch: {
      //         id: newBranch.id,
      //         name: newBranch.name,
      //       },
      //     },
      //   });
      // }
      return deletedProject;
    }),
});
