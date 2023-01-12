import { SquaresPlusIcon } from "@heroicons/react/20/solid";
import { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import { Activities, Projects } from "@/components/projects";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import { Container, Hr, Nav } from "@/components/theme";
import EmptyState from "@/components/theme/EmptyState";
import Audit from "@/lib/audit";
import prisma from "@/lib/prisma";

interface Props {
  user: User;
  logs: any;
}

const ConsoleHome: React.FC<Props> = ({ user, logs }) => {
  // @ts-ignore
  const roles = user?.roles || [];

  return (
    <>
      {roles.length === 0 ? (
        <Container>
          <Nav user={user} />
          <EmptyState
            icon={<SquaresPlusIcon className="m-3 mx-auto h-12 w-12" />}
            title={`Welcome to Envless`}
            subtitle="Get started by creating your first project."
          >
            <CreateProjectModal />
          </EmptyState>
        </Container>
      ) : (
        <>
          <Container>
            <Nav user={user} />
          </Container>

          <Hr />

          <Container>
            <div className="-mx-4 my-12 -mb-4 flex flex-wrap">
              <div className="mb-4 w-full px-4 md:mb-0 md:w-1/2 lg:w-2/3">
                <Projects projects={roles.map((role: any) => role.project)} />
              </div>
              <div className="mb-4 w-full px-4 md:mb-0 md:w-1/2 lg:w-1/3">
                <Activities logs={logs} user={user} />
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
    // @ts-ignore
    const userId = session?.user?.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: {
        roles: {
          include: {
            project: {
              include: {
                _count: {
                  select: {
                    roles: true,
                    branches: true,
                  },
                },
              },
            },
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
    }

    const logs = await Audit.logs({
      userId: user.id,
      limit: 10,
    });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        logs: JSON.parse(JSON.stringify(logs)),
      },
    };
  }
}

export default ConsoleHome;
