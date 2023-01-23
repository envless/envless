import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "@/utils/get-server-auth-session";
import { SquaresPlusIcon } from "@heroicons/react/20/solid";
import { User } from "@prisma/client";
import { AuditLogs, Projects } from "@/components/projects";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import { Button, Container, Hr, Nav } from "@/components/theme";
import EmptyState from "@/components/theme/EmptyState";
import Audit from "@/lib/audit";
import prisma from "@/lib/prisma";

interface Props {
  user: User;
  logs: any;
}

const ConsoleHome: React.FC<Props> = ({ user, logs }) => {
  // @ts-ignore
  const access = user?.access || [];
  const projects = access.map((a: any) => a.project);

  return (
    <>
      {projects.length === 0 ? (
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
                <Projects projects={projects} />
              </div>
              <div className="mb-4 w-full px-4 md:mb-0 md:w-1/2 lg:w-1/3">
                <div className="md:px-14">
                  <h2 className="mb-8 text-lg">Audit logs</h2>
                  <AuditLogs logs={logs} user={user} />

                  <Button
                    small={true}
                    outline={true}
                    className="mt-8"
                    href="/settings/audits"
                  >
                    More audit logs
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </>
      )}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

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
        access: {
          include: {
            project: {
              include: {
                _count: {
                  select: {
                    access: true,
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

    const access = user?.access || [];
    const projects = access.map((a: any) => a.project);
    const projectIds = projects.map((project: any) => project.id);
    const logs = await Audit.logs({
      createdById: userId,
      actions: ["updated.account"],
      projectIds: projectIds,
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
