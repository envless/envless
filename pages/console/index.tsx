import { useState } from "react";
import prisma from "@/lib/prisma";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Project, User } from "@prisma/client";
import EmptyState from "@/components/theme/EmptyState";
import { useForm, SubmitHandler } from "react-hook-form";
import { Projects, Nav, Activities } from "@/components/console";
import { Button, Input, Modal, Container, Hr } from "@/components/theme";

import {
  PlusIcon,
  ArrowRightIcon,
  SquaresPlusIcon,
} from "@heroicons/react/20/solid";

interface Props {
  user: User;
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

  // @ts-ignore
  const roles = user?.roles || [];

  return (
    <>
      {roles.length === 0 ? (
        <Container>
          <Nav user={user} />
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
        </Container>
      ) : (
        <>
          <Container>
            <Nav user={user} />
          </Container>

          <Hr />

          <Container>
            <div className="-mx-4 -mb-4 flex flex-wrap my-12">
              <div className="mb-4 w-full px-4 md:mb-0 lg:w-2/3 md:w-1/2">
                <Projects projects={roles.map((role: any) => role.project)} />
              </div>
                <div className="mb-4 w-full px-4 md:mb-0 lg:w-1/3 md:w-1/2">
                <Activities />
              </div>
            </div>
          </Container>
        </>
      )}
    </>
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
      console.log("User with roles and projets", user);
      return {
        props: {
          user: JSON.parse(JSON.stringify(user)),
        },
      };
    }
  }
}

export default ConsoleHome;
