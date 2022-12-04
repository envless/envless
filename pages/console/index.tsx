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

const ConsoleHome: React.FC<Props> = ({ currentUser, teams, projects }) => {
  const teamCollection = Object.values(teams);
  const projectCollection = Object.values(projects);

  return (
    <>
      <Container>
        <Nav currentUser={currentUser} />
      </Container>

      <Container>
        {teamCollection?.length === 0 && projectCollection?.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-md">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-lightest p-4 shadow-md">
                <h2 className="mb-2 text-xl font-semibold">Teams</h2>
                <ul>
                  {teamCollection.map((team) => (
                    <li key={team.id}>
                      <a href={`/console/teams/${team.id}`}>{team.name}</a>
                    </li>
                  ))}
                </ul>

                <a
                  href="/console/teams/new"
                  className="mt-4 block text-sm text-gray-500"
                >
                  Create a new team
                </a>

                <a
                  href="/console/teams"
                  className="mt-4 block text-sm text-gray-500"
                >
                  View all teams
                </a>
              </div>
            </div>
          </div>
        )}
      </Container>
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
        teams: true,
        projects: true,
      },
    });

    console.log("currentUser", currentUser);
    console.log("User with teams", user);

    return {
      props: {
        teams: user?.teams,
        projects: user?.projects,
        currentUser: currentUser,
      },
    };
  }
}

export default ConsoleHome;
