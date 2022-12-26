import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import { Container, Hr } from "@/components/theme";
import EmptyState from "@/components/theme/EmptyState";
import { Projects, Nav, Activities } from "@/components/console";
import CreateProjectModal from "@/components/console/CreateProjectModal";
import { SquaresPlusIcon } from "@heroicons/react/20/solid";

interface Props {
  user: User;
}

const ConsoleHome: React.FC<Props> = ({ user }) => {
  // @ts-ignore
  const roles = user?.roles || [];

  return (
    <>
      {roles.length === 0 ? (
        <Container>
          <Nav user={user} />
          <EmptyState
            icon={
              <SquaresPlusIcon className="m-3 mx-auto h-12 w-12" />
            }
            title={`Welcome to Envless`}
            subtitle="Get started by creating a new project."
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
