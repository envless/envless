import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import EmptyState from "@/components/console/EmptyState";
import Wrapper from "@/components/console/Wrapper";

type Props = {
  orgs: Object;
  currentUser: Object;
};

const ConsoleHome: React.FC<Props> = ({ currentUser, orgs }) => {
  const orgArray = Object.values(orgs);

  return (
    <Wrapper currentUser={currentUser}>
      {orgArray.length === 0 ? (
        <EmptyState />
      ) : (
        <pre>{JSON.stringify(orgArray, null, 2)}</pre>
      )}
    </Wrapper>
  );
};

export async function getServerSideProps(context: { req: any }) {
  let projects = [];

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
        orgs: true,
      },
    });

    const orgIds = user?.orgs.map((org) => org.id) || [];

    if (orgIds.length != 0) {
      const projects = await prisma.project.findMany({
        where: {
          orgId: {
            in: orgIds,
          },
        },
      });
    }

    const orgs = user?.orgs;

    return {
      props: {
        orgs,
        projects,
        currentUser,
      },
    };
  }
}

export default ConsoleHome;
