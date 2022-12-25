import { useState } from "react";
import prisma from "@/lib/prisma";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { getSession } from "next-auth/react";
import Wrapper from "@/components/console/Wrapper";
import EmptyState from "@/components/theme/EmptyState";
import { Button, Input, Modal } from "@/components/theme";
import { Project, User } from "@prisma/client";

import {
  PlusIcon,
  ArrowRightIcon,
  SquaresPlusIcon,
} from "@heroicons/react/20/solid";

interface Props {
  user: any;
}

interface NewProject {
  name: string;
}

const ConsoleHome: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const projectMutation = trpc.projects.create.useMutation({
    onSuccess: (data) => {
      const { id } = data;
      router.push(`/console/projects/${id}`);
    },

    onError: (error) => {
      console.log("Mutation error", error);
    },
  });

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const createProject: SubmitHandler<NewProject> = async (data) => {
    const { name } = data;
    setLoading(true);

    if (!name) {
      setLoading(false);
      return;
    }

    projectMutation.mutate({ project: { name: name } });
    reset();
  };

  const roles = user?.roles || [];

  return (
    <Wrapper user={user}>
      {roles.length === 0 ? (
        <EmptyState
          icon={
            <SquaresPlusIcon className="m-3 mx-auto h-12 w-12 text-teal-300" />
          }
          title={`Welcome to Envless`}
          subtitle="Get started by creating a new project."
        >
          <Modal
            button={
              <Button>
                <PlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                New project
              </Button>
            }
            title="Create a new project"
          >
            <form onSubmit={handleSubmit(createProject)}>
              <Input
                name="name"
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
        <>
          {roles.map((role: any) => {
            const { project } = role;
            return <>{project.name}</>;
          })}
        </>
      )}
    </Wrapper>
  );
};

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        id: session.user.id,
      },
      include: {
        roles: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!user) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          user: JSON.parse(JSON.stringify(user)),
        },
      };
    }
  }
}

export default ConsoleHome;
