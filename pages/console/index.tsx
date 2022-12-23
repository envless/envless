import { z } from "zod";
import { useState } from "react";
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import Wrapper from "@/components/console/Wrapper";
import { PlusIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import EmptyState from "@/components/theme/EmptyState";
import { Button, Input, Modal } from "@/components/theme";

type Props = {
  workspaces: Object;
  currentUser: Object;
};

const ConsoleHome: React.FC<Props> = ({ currentUser, workspaces }) => {
  const spaces = Object.values(workspaces);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState("");
  const [workspace, setWorkspace] = useState("");

  const workspaceSchema = z.object({
    workspace: z.string(),
    project: z.string(),
  });

  const createWorkspace = async () => {
    const body = { project, workspace };
    const validated = workspaceSchema.safeParse(body);

    if (!validated.success) {
      return;
    } else {
      setLoading(true);

      const res = await fetch("/api/v1/workspaces", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log(data);
      console.log("Creating workspace ", workspace, " and project ", project);
    }
  };

  return (
    <Wrapper currentUser={currentUser}>
      {" "}
      {spaces.length === 0 ? (
        <EmptyState
          icon={<HiOutlineViewGridAdd className="m-3 mx-auto h-12 w-12" />}
          title={`You don't have any workspaces`}
          subtitle="Get started by creating a new workspace."
        >
          <Modal
            button={
              <Button>
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New workspace
              </Button>
            }
            title="Create a new workspace"
          >
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await createWorkspace();
              }}
            >
              <Input
                id="workspace"
                name="workspace"
                required={true}
                label="Workspace name"
                placeholder="Acme Inc."
                onChange={(e) => setWorkspace(e.target.value)}
              />

              <Input
                id="project"
                name="project"
                required={true}
                label="Project name"
                placeholder="Project X"
                onChange={(e) => setProject(e.target.value)}
              />

              <div className="float-right">
                <Button type="submit" disabled={loading}>
                  Save and continue
                  <ArrowRightIcon
                    className="-mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
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
