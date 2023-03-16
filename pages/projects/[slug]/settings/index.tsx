import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { Project } from "@prisma/client";
import { useForm } from "react-hook-form";
import ProjectSettings from "@/components/projects/ProjectSettings";
import { Button, Input, Paragraph, Toggle } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
import prisma from "@/lib/prisma";

/**
 * A functional component that represents a project.
 * @param {SettingProps} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 */

interface SettingsPageProps {
  projects: Project[];
  currentProject: Project;
}

export const SettingsPage = ({
  projects,
  currentProject,
}: SettingsPageProps) => {
  const router = useRouter();
  const props = { projects, currentProject };

  const { register, handleSubmit } = useForm();

  const { mutate: projectGeneralMutation, isLoading } =
    trpc.projects.update.useMutation({
      onSuccess: (data) => {
        showToast({
          type: "success",
          title: "Project setting updated successfully",
          subtitle: "",
        });
        router.push(router.asPath);
      },
      onError: (error) => {
        showToast({
          type: "error",
          title: "Project setting update failed",
          subtitle: error.message,
        });
      },
    });

  const submitForm = (values) => {
    const { name, enforce2FA } = values;

    projectGeneralMutation({
      project: {
        ...currentProject,
        name,
        enforce2FA,
      },
    });
  };

  return (
    <ProjectLayout
      tab="settings"
      projects={projects}
      currentProject={currentProject}
    >
      <ProjectSettings
        active="general"
        projects={projects}
        currentProject={currentProject}
      >
        <>
          <h3 className="mb-8 text-lg">General</h3>
          <div className="w-full lg:w-3/5">
            <form onSubmit={handleSubmit(submitForm)}>
              <Input
                name="name"
                label="Project name"
                placeholder=""
                defaultValue={currentProject.name || ""}
                required={true}
                register={register}
                className="w-full"
                validationSchema={{
                  required: "Project name is required",
                }}
              />
              <div className="mb-6 rounded border-2 border-dark p-3">
                <div className="flex items-center justify-between">
                  <label className="cursor-pointer" htmlFor="auth_2fa">
                    <h3 className="mb-1 text-sm font-semibold">
                      Enforce two-factor authentication
                    </h3>
                    <Paragraph color="light" size="sm" className="mr-4">
                      After enabling this feature, all team members should
                      enable their two-factor authentication to access this
                      project.
                    </Paragraph>
                  </label>

                  <Toggle
                    checked={currentProject.settings?.enforce2FA || false}
                    name="enforce2FA"
                    register={register}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading || false}>
                Save project settings
              </Button>
            </form>
          </div>
        </>
      </ProjectSettings>
    </ProjectLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
  const user = session?.user;

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
          slug: true,
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
  const currentProject = projects.find((p) => p.slug === slug);

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
