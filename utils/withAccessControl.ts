import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { accessesWithProject } from "@/models/access";
import { getServerSideSession } from "./session";

type PageProps = {};

type AccessControlPageProps = PageProps & {
  currentProject: any;
  projects: any;
};

export function withAccessControl<P = Record<string, unknown>>({
  checkProjectOwner = false,
  getServerSideProps,
}: {
  getServerSideProps?: GetServerSideProps<P & PageProps>;
  checkProjectOwner: boolean;
}) {
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
      if (a.role === "owner") {
        return {
          project: a.project,
          role: a.role,
        };
      }
      return {
        project: a.project,
        role: null,
      };
    });

    const projects = projectsWithRole.map((pr) => pr.project);

    const currentProject = projectsWithRole.find(
      (pr) =>
        pr.project.slug === slug &&
        (checkProjectOwner ? pr.role === "owner" : true),
    );

    if (!currentProject) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        ...serverPropsFromParent.props,
        currentProject: JSON.parse(JSON.stringify(currentProject)),
        projects: JSON.parse(JSON.stringify(projects)),
      },
    };
  };
}
