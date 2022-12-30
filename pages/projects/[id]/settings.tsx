import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { Project } from "@prisma/client";
import ProjectLayout from "@/layouts/Project";

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

export const SettingsPage = ({ projects, currentProject }: Props) => {
  return (
    <ProjectLayout
      tab="settings"
      projects={projects}
      currentProject={currentProject}
    >
      <h1>SettingsPage for {currentProject.name}</h1>
    </ProjectLayout>
  );
};

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });
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

  const roles = await prisma.role.findMany({
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

  if (!roles) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  const projects = roles.map((role) => role.project);
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

export default SettingsPage;
