import DeleteProjectNotice from "@/emails/DeleteProjectNotice";
import { env } from "@/env/index.mjs";
import Project from "@/models/projects";
import { createRouter, withAuth } from "@/trpc/router";
import { PROJECT_CREATED } from "@/types/auditActions";
import { formatDateTime } from "@/utils/helpers";
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
          action: PROJECT_CREATED,
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
      const { project } = input;
      const user = ctx.session.user;

      const softDeletedProject = await Project.deleteProject({
        id: project.id,
        softDelete: true,
      });

      await Audit.create({
        createdById: user.id,
        projectId: softDeletedProject.id,
        action: "project.delete_requested",
        data: {
          project: {
            id: softDeletedProject.id,
            name: softDeletedProject.name,
          },
        },
      });

      await sendMail({
        subject: `Project Deletion Notice - ${softDeletedProject?.name}`,
        to: user.email,
        component: (
          <>
            <DeleteProjectNotice
              headline={
                <>
                  Project Deletion Notice - <b>{softDeletedProject?.name}</b>
                </>
              }
              body={
                <>
                  This is to inform you that {softDeletedProject?.name} has been
                  requested to be deleted by {user.name} on{" "}
                  {formatDateTime(softDeletedProject.deletedAt as Date)}. If
                  this was done on purpose, the project will be permanently
                  deleted within 7 days.
                  <br />
                  <br />
                  To reactive the project, please login to your account and
                  follow the steps to cancel the deletion request.
                  <br />
                  <br />
                  Please note that all information related to this project,
                  including branches, pull requests, and other associated data,
                  will be permanently deleted once the project is deleted.
                </>
              }
              greeting="Hi there,"
              buttonText="Login"
              buttonLink={`${env.BASE_URL}/auth/login`}
            />
          </>
        ),
      });

      return softDeletedProject;
    }),
});
