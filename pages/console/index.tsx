import prisma from "@/lib/prisma";
import { Button } from "@/components/theme";
import { getSession } from "next-auth/react";
import Wrapper from "@/components/console/Wrapper";
import { PlusIcon } from "@heroicons/react/20/solid";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import EmptyState from "@/components/theme/EmptyState";

type Props = {
  workspaces: Object;
  currentUser: Object;
};

const ConsoleHome: React.FC<Props> = ({ currentUser, workspaces }) => {
  const spaces = Object.values(workspaces);

  return (
    <Wrapper currentUser={currentUser}>
      {" "}
      {spaces.length === 0 ? (
        <EmptyState
          icon={<HiOutlineViewGridAdd className="m-3 mx-auto h-12 w-12" />}
          title={`You don't have any workspaces`}
          subtitle="Get started by creating a new workspace."
        >
          <Button
            onClick={() => {
              console.log("Create new workspace");
            }}
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New workspace
          </Button>
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
