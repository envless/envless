import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  Redirect,
} from "next";
import prisma from "@/lib/prisma";
import { getServerSideSession } from "./session";

type PageProps = {
  props?: {
    redirect?: Redirect;
  };
};

type KeychainVerificationPageProps = PageProps & {
  currentProject: Project;
  projects: Project[];
  currentRole: UserRole;
};

type KeychainVerificationParams<P> = {
  hasAccess?: Partial<{
    roles: UserRole[];
    statuses: MembershipStatus[];
  }>;
  withEncryptedProjectKey?: boolean;
  getServerSideProps?: GetServerSideProps<P & PageProps>;
};

export function withKeychainVerification<P = Record<string, unknown>>({
  withEncryptedProjectKey = false,
  getServerSideProps,
  hasAccess = { roles: [], statuses: [] },
}: KeychainVerificationParams<P>): (
  context: GetServerSidePropsContext,
) => Promise<GetServerSidePropsResult<KeychainVerificationPageProps>> {
  return async (
    context: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<KeychainVerificationPageProps>> => {
    const session = await getServerSideSession(context);
    const user = session?.user;

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    let serverPropsFromParent: any = { props: {} };

    if (getServerSideProps) {
      serverPropsFromParent = await getServerSideProps(context);
    }

    // Check if there are any reason to redirect from parent getServerSideProps
    if (serverPropsFromParent.props.redirect) {
      return {
        redirect: {
          ...serverPropsFromParent.props.redirect,
        },
      };
    }

    // @ts-ignore
    const { slug } = context.params;

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
        status: a.status,
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

    let authorizedByRole = false;
    let authorizedByStatus = false;

    if (
      hasAccess.statuses &&
      hasAccess.statuses.includes(currentProject.status)
    ) {
      authorizedByStatus = true;
      if (hasAccess.roles && hasAccess.roles.includes(currentProject.role)) {
        authorizedByRole = true;
      }
    }

    if (!authorizedByStatus) {
      return {
        notFound: true,
      };
    }

    if (!authorizedByRole) {
      return {
        redirect: {
          destination: "/projects",
          permanent: false,
        },
      };
    }

    let encryptionProps = {};

    if (withEncryptedProjectKey) {
      const keychain = await prisma.keychain.findFirst({
        where: {
          userId: user?.id,
        },
        select: {
          publicKey: true,
        },
      });

      const { publicKey } = keychain || { publicKey: null };

      const encryptedProjectKey = await prisma.encryptedProjectKey.findFirst({
        where: { projectId: currentProject.project.id },
        select: {
          encryptedKey: true,
        },
      });

      encryptionProps = {
        publicKey,
        encryptedProjectKey,
      };
    }

    return {
      props: {
        ...encryptionProps,
        ...serverPropsFromParent.props,
        currentProject: JSON.parse(JSON.stringify(currentProject.project)),
        currentRole: currentProject.role,
        projects: JSON.parse(JSON.stringify(projects)),
        user,
      },
    };
  };
}
