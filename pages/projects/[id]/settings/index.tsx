import { type GetServerSidePropsContext } from "next";
import ProjectLayout from "@/layouts/Project";
import type { SettingProps } from "@/types/projectSettingTypes";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import { useForm } from "react-hook-form";
import ProjectSettings from "@/components/projects/ProjectSettings";
import Tabs from "@/components/settings/Tabs";
import {
  Button,
  Container,
  Hr,
  Input,
  Paragraph,
  Toggle,
} from "@/components/theme";
import prisma from "@/lib/prisma";

/**
 * A functional component that represents a project.
 * @param {SettingProps} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 */

export const SettingsPage = ({ projects, currentProject }: SettingProps) => {
  const props = { projects, currentProject };

  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const submitForm = (data) => {
    console.log(data, "hello");
  };

  return (
    <ProjectLayout tab="settings" {...props}>
      <ProjectSettings active="general" {...props}>
        <h3 className="mb-8 text-lg">General</h3>
        <div className="w-full lg:w-3/5">
          <form onSubmit={handleSubmit(submitForm)}>
            <Input
              name="project_name"
              label="Project Name"
              placeholder=""
              defaultValue={currentProject.name || ""}
              required={true}
              register={register}
              className="w-full"
              validationSchema={{
                required: "Project name is required",
              }}
            />
            <Button type="submit" disabled={false}>
              Save project settings
            </Button>
          </form>
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

export default SettingsPage;
