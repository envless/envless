import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import Wrapper from "@/components/console/Wrapper";
import EmptyState from "@/components/console/EmptyState";

type Props = {
  workspaces: Object;
  currentUser: Object;
};

const ConsoleHome: React.FC<Props> = ({ currentUser, workspaces }) => {
  const spaces = Object.values(workspaces);

  return (
    <Wrapper currentUser={currentUser}>
      {spaces.length === 0 ? (
        <EmptyState />
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
