import { type GetServerSidePropsContext } from "next";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";
import ProjectSettings from "@/components/projects/ProjectSettings";
import { Paragraph } from "@/components/theme";
import prisma from "@/lib/prisma";

/**
 * A functional component that represents a project.
 * @param {SettingProps} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 */

interface DangerPageProps {
  projects: Project[];
  currentProject: Project;
}

export const DangerZone = ({ projects, currentProject }: DangerPageProps) => {
  const props = { projects, currentProject };

  return (
    <ProjectLayout tab="settings" {...props}>
      <ProjectSettings active="danger" {...props}>
        <h3 className="mb-7 text-lg text-red-400">Danger</h3>
        <div className="flex w-full flex-row items-center justify-between  lg:w-[65%]">
          <div className="flex-1">
            <Paragraph size="sm" className="font-semibold">
              Delete this project
            </Paragraph>
            <Paragraph size="sm" className="mt-4 text-sm font-light">
              Once you delete a project, there is no going back. Please be
              certain.
            </Paragraph>
          </div>
          <div className="flex-2 ml-10">
            <DeleteProjectModal project={currentProject} />
          </div>
        </div>
      </ProjectSettings>
    </ProjectLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
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

  const projects = access.map((a) => a.project);
  const currentProject = projects.find((p) => p.id === id);

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

export default DangerZone;
