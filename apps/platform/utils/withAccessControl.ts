import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { accessesWithProject } from "@/models/access";
import prisma from "@/lib/prisma";
import { getServerSideSession } from "./session";

type PageProps = {};

type AccessControlPageProps = PageProps & {
  currentProject: any;
  projects: any;
  projectRole: any;
};

type AccessControlParams<P> = {
  getServerSideProps?: GetServerSideProps<P & PageProps>;
  checkProjectOwner?: boolean;
  withEncryptedProjectKey?: boolean;
};

export function withAccessControl<P = Record<string, unknown>>({
  checkProjectOwner = false,
  withEncryptedProjectKey = false,
  getServerSideProps,
}: AccessControlParams<P>) {
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
      (pr) =>
        pr.project.slug === slug &&
        (checkProjectOwner ? pr.role === "owner" : true),
    );

    if (!currentProject) {
      if (checkProjectOwner) {
        return {
          notFound: true,
        };
      } else {
        return {
          redirect: {
            destination: "/projects",
            permanent: false,
          },
        };
      }
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
        projectRole: currentProject.role,
        projects: JSON.parse(JSON.stringify(projects)),
        user,
      },
    };
  };
}
