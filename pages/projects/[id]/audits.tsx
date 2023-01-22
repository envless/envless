import ProjectLayout from "@/layouts/Project";
import { Project } from "@prisma/client";
import prisma from "@/lib/prisma";
import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/utils/get-server-auth-session";

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 */

interface Props {
  projects: Project[];
  currentProject: Project;
}

export const AuditLogsPage = ({ projects, currentProject }: Props) => {
  return (
    <ProjectLayout
      tab="audits"
      projects={projects}
      currentProject={currentProject}
    >
      <h1>AuditLogsPage for {currentProject.name}</h1>
    </ProjectLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  const user = session?.user;

  // @ts-ignore
  const { id } = context.params;

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const access = await prisma.access.findMany({
    where: {
      // @ts-ignore
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

  if (!access) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  const projects = access.map((access) => access.project);
  const currentProject = projects.find((project) => project.id === id);

  if (!currentProject) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  return {
    props: {
      currentProject: JSON.parse(JSON.stringify(currentProject)),
      projects: JSON.parse(JSON.stringify(projects)),
    },
  };
}

export default AuditLogsPage;
