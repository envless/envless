import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import { Project, UserRole } from "@prisma/client";
import ConfirmationModal from "@/components/projects/ConfirmationModal";
import ProjectSettings from "@/components/projects/ProjectSettings";
import { Button, Paragraph } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";

/**
 * A functional component that represents a project.
 * @param {SettingProps} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {roleInProject} props.roleInProject - The user role in current project.
 */

interface DangerPageProps {
  projects: Project[];
  currentProject: Project;
  roleInProject: UserRole;
}

export const DangerZone = ({
  projects,
  currentProject,
  roleInProject,
}: DangerPageProps) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const router = useRouter();
  const props = {
    projects,
    currentProject: currentProject,
    roleInCurrentProject: roleInProject,
  };

  const { mutate: projectDeleteMutation, isLoading } =
    trpc.projects.delete.useMutation({
      onSuccess: () => {
        showToast({
          type: "success",
          title: "Project Deleted successfully",
          subtitle: "",
        });
        router.push("/projects");
      },
      onError: (error) => {
        showToast({
          type: "error",
          title: "Project Delete failed",
          subtitle: "",
        });
      },
    });

  const onConfirm = useCallback(() => {
    projectDeleteMutation({
      project: { id: currentProject.id },
    });
  }, [currentProject.id, projectDeleteMutation]);

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
            <Button
              type="button"
              variant="danger-outline"
              disabled={isLoading || false}
              onClick={() => {
                setIsConfirmationModalOpen(true);
              }}
            >
              Delete this project
            </Button>
          </div>
          <ConfirmationModal
            title={"Delete Project"}
            descriptionComponent={
              <span className="leading-normal">
                This action{" "}
                <strong className="text-lighter font-bold">CANNOT</strong> be
                undone. This will permanently delete the{" "}
                <strong className="text-lighter font-bold">
                  {currentProject.name}
                </strong>{" "}
                project, env keys, branches, pull requests and remove all
                collaborator associations after 7 days.
              </span>
            }
            onConfirmAction={onConfirm}
            open={isConfirmationModalOpen}
            setOpen={setIsConfirmationModalOpen}
            confirmButtonText="I understand, delete this project"
            validationInputProps={{
              name: "name",
              type: "text",
              label: "Please type in the name of the project to confirm.",
              errorText: "Required",
              placeholder: "Enter project name",
              validationText: currentProject.name,
            }}
          />
        </div>
      </ProjectSettings>
    </ProjectLayout>
  );
};

export const getServerSideProps = withAccessControl({
  hasAccess: { owner: true },
});

export default DangerZone;
