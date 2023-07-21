import DeleteProjectNotice from "@/emails/DeleteProjectNotice";
import ProjectRestorationNotice from "@/emails/ProjectRestorationNotice";
import { env } from "@/env/index.mjs";
import Project from "@/models/projects";
import { createRouter, withAuth } from "@/trpc/router";
import {
  ACCESS_CREATED,
  BRANCH_CREATED,
  PROJECT_CREATED,
  PROJECT_DELETE_REQUESTED,
  PROJECT_RESTORED,
} from "@/types/auditActions";
import { formatDateTime } from "@/utils/helpers";
import sendMail from "emails";
import { kebabCase } from "lodash";
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
          slug: kebabCase(project.slug),
          access: {
            create: {
              userId: user.id,
              role: "owner",
              status: "active",
            },
          },
          branches: {
            createMany: {
              data: [
                {
                  name: "main",
                  protected: true,
                  description: "Main branch is protected by default",
                  protectedAt: new Date(),
                  createdById: user.id,
                },
                {
                  name: "staging",
                  protected: true,
                  description: "Staging branch is protected by default",
                  protectedAt: new Date(),
                  createdById: user.id,
                },
                {
                  name: "development",
                  protected: true,
                  description: "Development branch is protected by default",
                  protectedAt: new Date(),
                  createdById: user.id,
                },
              ],
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
          data: {
            project: {
              id: newProject.id,
              name: newProject.name,
            },
          },
        });

        const access = newProject.access[0];
        const branches = newProject.branches;

        await Audit.create({
          createdById: user.id,
          createdForId: user.id,
          projectId: newProject.id,
          action: ACCESS_CREATED,
          data: {
            access: {
              id: access.id,
              role: access.role,
            },
          },
        });

        branches.forEach(async (branch) => {
          await Audit.create({
            createdById: user.id,
            projectId: newProject.id,
            action: BRANCH_CREATED,
            data: {
              branch: {
                id: branch.id,
                name: branch.name,
              },
            },
          });
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
          twoFactorRequired: z.boolean(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { project } = input;
      const { name } = project;
      const twoFactorRequired = project.twoFactorRequired || false;

      const updatedProject = await prisma.project.update({
        where: {
          id: project.id,
        },
        data: { name, twoFactorRequired },
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
        action: PROJECT_DELETE_REQUESTED,
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
              buttonLink={`${env.BASE_URL}/login`}
            />
          </>
        ),
      });

      return softDeletedProject;
    }),

  restoreProject: withAuth
    .input(
      z.object({
        project: z.object({ id: z.string().min(1, "project id is required") }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { project } = input;
      const user = ctx.session.user;
      const projectAccess = await ctx.prisma.access.findFirst({
        where: {
          projectId: project.id,
          userId: user.id,
          role: "owner",
        },
      });
      if (!projectAccess) {
        throw new Error("You are not the owner of this project");
      }

      const restoredProject = await Project.restoreProject(project.id);

      await Audit.create({
        createdById: user.id,
        projectId: restoredProject.id,
        action: PROJECT_RESTORED,
        data: {
          project: {
            id: restoredProject.id,
            name: restoredProject.name,
          },
        },
      });

      await sendMail({
        subject: `Project Restoration Notice - ${restoredProject?.name}`,
        to: user.email,
        component: (
          <>
            <ProjectRestorationNotice
              headline={
                <>
                  Project Restoration Notice - <b>{restoredProject?.name}</b>
                </>
              }
              body={
                <>
                  This is to inform you that {restoredProject?.name} has been
                  restored by {user.name} on{" "}
                  {formatDateTime(restoredProject.updatedAt as Date)}.
                  <br />
                  <br />
                  To access the project, please login to your account and follow
                  the steps to access the project.
                </>
              }
              greeting="Hi there,"
              buttonText="Login"
              buttonLink={`${env.BASE_URL}/login`}
            />
          </>
        ),
      });
    }),

  getEncryptionKeys: withAuth
    .input(
      z.object({
        projectId: z.string(),
      }),
    )

    .query(async ({ ctx, input }) => {
      const { projectId } = input;
      const user = ctx.session.user;

      const project = await ctx.prisma.project.findFirst({
        where: {
          id: projectId,
        },

        select: {
          encryptedProjectKey: true,

          access: {
            select: {
              user: {
                select: {
                  keychain: {
                    select: {
                      publicKey: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const publicKeys = project?.access.map(
        (access) => access?.user?.keychain?.publicKey,
      );

      return {
        publicKeys,
        encryptedProjectKey: project?.encryptedProjectKey,
      };
    }),
});
