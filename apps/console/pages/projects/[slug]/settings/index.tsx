import { useRouter } from "next/router";
import ProjectLayout from "@/layouts/Project";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import { MembershipStatus, Project, UserRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import ProjectSettings from "@/components/projects/ProjectSettings";
import { Button, Input, Paragraph, Toggle } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";

/**
 * A functional component that represents a project.
 * @param {SettingProps} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {currentRole} props.currentRole - The user role in current project.
 */

interface Props {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
}

export const SettingsPage = ({
  projects,
  currentRole,
  currentProject,
}: Props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: projectGeneralMutation, isLoading } =
    trpc.projects.update.useMutation({
      onSuccess: ({ name }) => {
        showToast({
          type: "success",
          title: `Project ${name} setting updated successfully`,
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
    const { name, twoFactorRequired } = values;

    projectGeneralMutation({
      project: {
        ...currentProject,
        name,
        twoFactorRequired,
      },
    });
  };

  return (
    <ProjectLayout
      tab="settings"
      projects={projects}
      currentProject={currentProject}
      currentRole={currentRole}
    >
      <ProjectSettings
        active="general"
        projects={projects}
        currentProject={currentProject}
        currentRole={currentRole}
      >
        <h3 className="mb-8 text-lg">General</h3>
        <div className="w-full lg:w-3/5">
          <form onSubmit={handleSubmit(submitForm)}>
            <Input
              name="name"
              label="Project name"
              defaultValue={currentProject.name || ""}
              register={register}
              className="w-full"
              errors={errors}
              validationSchema={{
                required: "Project name is required",
              }}
              required
            />
            <div className="border-dark mb-6 rounded border-2 p-3">
              <div className="flex items-center justify-between">
                <label className="cursor-pointer" htmlFor="auth_2fa">
                  <h3 className="mb-1 text-sm font-semibold">
                    Enforce two-factor authentication
                  </h3>
                  <Paragraph color="light" size="sm" className="mr-4">
                    After enabling this feature, all team members should enable
                    their two-factor authentication to access this project.
                  </Paragraph>
                </label>

                <Toggle
                  checked={currentProject.twoFactorRequired || false}
                  name="twoFactorRequired"
                  register={register}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading || false}>
              Save project settings
            </Button>
          </form>
        </div>
      </ProjectSettings>
    </ProjectLayout>
  );
};

export const getServerSideProps = withAccessControl({
  hasAccess: {
    roles: [UserRole.maintainer, UserRole.owner],
    statuses: [MembershipStatus.active],
  },
});

export default SettingsPage;
