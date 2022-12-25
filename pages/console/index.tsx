import { useState } from "react";
import prisma from "@/lib/prisma";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { getSession } from "next-auth/react";
import Wrapper from "@/components/console/Wrapper";
import EmptyState from "@/components/theme/EmptyState";
import { Button, Input, Modal } from "@/components/theme";
import { Workspace, Project, User } from "@prisma/client";

import {
  PlusIcon,
  ArrowRightIcon,
  SquaresPlusIcon,
} from "@heroicons/react/20/solid";

interface Props {
  workspaces: Workspace[];
  currentUser: User;
}

interface NewWorkspace {
  workspaceName: string;
  projectName: string;
}

const ConsoleHome: React.FC<Props> = ({ currentUser, workspaces }) => {
  const router = useRouter();
  const spaces = Object.values(workspaces);
  const [loading, setLoading] = useState(false);
  const workspaceMutation = trpc.workspaces.create.useMutation({
    onSuccess: (data) => {
      const { id } = data;
      router.push(`/console/${id}`);
    },

    onError: (error) => {
      console.log("Mutation error", error);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const createWorkspace: SubmitHandler<NewWorkspace> = async (data) => {
    const { workspaceName, projectName } = data;
    console.log("Creating workspace ", data);
    setLoading(true);

    if (!workspaceName || !projectName) {
      setLoading(false);
      return;
    }

    workspaceMutation.mutate({
      workspace: { name: workspaceName },
      project: { name: projectName },
    });

    reset();
  };

  return (
    <Wrapper currentUser={currentUser}>
      {" "}
      {spaces.length === 0 ? (
        <EmptyState
          icon={
            <SquaresPlusIcon className="m-3 mx-auto h-12 w-12 text-teal-300" />
          }
          title={`You don't have any workspaces`}
          subtitle="Get started by creating a new workspace."
        >
          <Modal
            button={
              <Button>
                <PlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                New workspace
              </Button>
            }
            title="Create a new workspace"
          >
            <form onSubmit={handleSubmit(createWorkspace)}>
              <Input
                name="workspaceName"
                label="Workspace name"
                placeholder="Acme Inc."
                required={true}
                register={register}
                errors={errors}
                defaultValue="Acme Inc."
                validationSchema={{
                  required: "Workspace name is required",
                }}
              />

              <Input
                name="projectName"
                label="Project name"
                placeholder="Project X"
                defaultValue="Project X"
                required={true}
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Project name is required",
                }}
              />

              <div className="float-right">
                <Button type="submit" disabled={loading}>
                  Save and continue
                  <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </form>
          </Modal>
        </EmptyState>
      ) : (
        <pre>{JSON.stringify(spaces, null, 2)}</pre>
      )}
    </Wrapper>
  );
};

export async function getServerSideProps(context: { req: any }) {
  let projects: any = [];

  const { req } = context;
  const session = await getSession({ req });
  const currentUser = session?.user;

  if (!session || !currentUser || !currentUser.email) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const user = await prisma.user.findUnique({
      where: {
        email: currentUser.email,
      },
      include: {
        workspaces: true,
      },
    });

    const workspaceIds =
      user?.workspaces.map((workspace: { id: any }) => workspace.id) || [];

    if (workspaceIds.length != 0) {
      projects = await prisma.project.findMany({
        where: {
          workspaceId: {
            in: workspaceIds,
          },
        },
      });

      projects ||= [];
    }

    const workspaces = user?.workspaces || [];

    return {
      props: {
        projects,
        workspaces,
        currentUser,
      },
    };
  }
}

export default ConsoleHome;
