import prisma from "@/lib/prisma";
import Nav from "@/components/console/Nav";
import { getSession } from "next-auth/react";
import EmptyState from "@/components/console/EmptyState";
import Container from "@/components/base/Container";

type Props = {
  teams: Object;
  projects: Object;
  currentUser: Object;
};

const ConsoleHome: React.FC<Props> = ({ currentUser, projects }) => {
  const projectArray = Object.values(projects);

  return (
    <>
      <Container>
        <Nav currentUser={currentUser} />
      </Container>

      <pre>
        {JSON.stringify(projectArray, null, 2)}
      </pre>
    </>
  );
};

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });
  const currentUser = session?.user;

  if (!session || !currentUser) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      include: {
        projects: true,
      },
    });

    console.log("currentUser", currentUser);
    console.log("User with teams", user);

    return {
      props: {
        projects: user?.projects,
        currentUser: currentUser,
      },
    };
  }
}

export default ConsoleHome;
