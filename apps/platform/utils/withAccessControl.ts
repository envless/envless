import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { accessesWithProject } from "@/models/access";
import { Project, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getServerSideSession } from "./session";

type PageProps = {};

type AccessControlPageProps = PageProps & {
  currentProject: Project;
  projects: Project[];
  roleInProject: UserRole;
};

type AccessControlParams<P> = {
  hasAccess?: Partial<Record<UserRole, boolean>>;
  withEncryptedProjectKey?: boolean;
  getServerSideProps?: GetServerSideProps<P & PageProps>;
};

export function withAccessControl<P = Record<string, unknown>>({
  withEncryptedProjectKey = false,
  getServerSideProps,
  hasAccess = {},
}: AccessControlParams<P>): (
  context: GetServerSidePropsContext,
) => Promise<GetServerSidePropsResult<AccessControlPageProps>> {
  return async (
    context: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<AccessControlPageProps>> => {
    const session = await getServerSideSession(context);
    const user = session?.user;

    let serverPropsFromParent: any = { props: {} };

    if (getServerSideProps) {
      serverPropsFromParent = await getServerSideProps(context);
    }

    // @ts-ignore
    const { slug } = context.params;

    if (!user) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    const access = await accessesWithProject({ userId: user.id });

    if (!access) {
      return {
        redirect: {
          destination: "/projects",
          permanent: false,
        },
      };
    }

    const projectsWithRole = access.map((a) => {
      return {
        project: a.project,
        role: a.role,
      };
    });

    const projects = projectsWithRole.map((pr) => pr.project);

    const currentProject = projectsWithRole.find(
      (pr) => pr.project.slug === slug,
    );

    if (!currentProject) {
      return {
        notFound: true,
      };
    }

    let authorized = false;

    Object.entries(hasAccess).forEach(([role, authorizedForRole]) => {
      if (authorizedForRole && currentProject.role === role) {
        authorized = true;
      }
    });

    if (!authorized) {
      return {
        redirect: {
          destination: "/projects",
          permanent: false,
        },
      };
    }

    let encryptionProps = {};

    if (withEncryptedProjectKey) {
      const publicKey = await prisma.publicKey.findFirst({
        where: {
          userId: user?.id,
        },
        select: {
          id: true,
          key: true,
        },
      });

      const encryptedProjectKey = await prisma.encryptedProjectKey.findFirst({
        where: { projectId: currentProject.project.id },
        select: {
          encryptedKey: true,
        },
      });

      encryptionProps = {
        publicKey: publicKey?.key || "",
        encryptedProjectKey,
      };
    }

    return {
      props: {
        ...serverPropsFromParent.props,
        ...encryptionProps,
        currentProject: JSON.parse(JSON.stringify(currentProject.project)),
        roleInProject: currentProject.role,
        projects: JSON.parse(JSON.stringify(projects)),
        user,
      },
    };
  };
}
