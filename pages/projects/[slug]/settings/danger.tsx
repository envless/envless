import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { SetStateAction, useCallback, useState } from "react";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { Project } from "@prisma/client";
import {
  FieldValues,
  RegisterOptions,
  UseFormRegisterReturn,
  useForm,
} from "react-hook-form";
import ConfirmationModal from "@/components/projects/ConfirmationModal";
import ProjectSettings from "@/components/projects/ProjectSettings";
import { Button, Paragraph } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
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
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const router = useRouter();
  const props = { projects, currentProject };

  const {
    register,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm();

  const slug = watch("slug");

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
        setError("slug", {
          message: "Please ensure that the entered slug is correct.",
        });
      },
    });

  const onConfirm = useCallback(() => {
    clearErrors(["slug"]);
    projectDeleteMutation({
      project: { ...currentProject, slug },
    });
  }, [clearErrors, currentProject, projectDeleteMutation, slug]);

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
                <strong className="font-bold text-lighter">CANNOT</strong> be
                undone. This will permanently delete the{" "}
                <strong className="font-bold text-lighter">
                  {currentProject.slug}
                </strong>{" "}
                project, env keys, branches, pull requests and remove all
                collaborator associations.
              </span>
            }
            onConfirmAction={onConfirm}
            open={isConfirmationModalOpen}
            setOpen={setIsConfirmationModalOpen}
            confirmButtonText="I understand, delete this project"
            validationInputProps={{
              name: "slug",
              type: "text",
              label: "Please type in the slug of the project to confirm.",
              errorText: "Required",
              placeholder: "Enter project slug",
              validationText: currentProject.slug,
            }}
          />
        </div>
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

export default DangerZone;
