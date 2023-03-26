import { useRouter } from "next/router";
import ProjectLayout from "@/layouts/Project";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import type { Project, UserRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import ProjectSettings from "@/components/projects/ProjectSettings";
import { Button, Input, Paragraph, Toggle } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";

/**
 * A functional component that represents a project.
 * @param {SettingProps} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {roleInProject} props.roleInProject - The user role in current project.
 */

interface SettingsPageProps {
  projects: Project[];
  currentProject: Project;
  roleInProject: UserRole;
}

export const SettingsPage = ({
  projects,
  roleInProject,
  currentProject,
}: SettingsPageProps) => {
  const router = useRouter();

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
      currentRole={roleInProject}
    >
      <ProjectSettings
        active="general"
        projects={projects}
        currentProject={currentProject}
        currentRole={roleInProject}
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
              <div className="border-dark mb-6 rounded border-2 p-3">
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
                    // TODO - create enforce2fa column instead of adding it to settings
                    // checked={currentProject.settings?.enforce2FA || false}
                    checked={false}
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

export const getServerSideProps = withAccessControl({
  hasAccess: { maintainer: true, owner: true },
});

export default SettingsPage;
