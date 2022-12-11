import cookie from "cookie";
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

export async function getServerSideProps(context: { req: any; res: any }) {
  const { req, res } = context;
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
        email: session?.user?.email ?? "",
      },
      include: {
        orgs: true,
      },
    });

    if (!user) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("next-auth.session-token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          expires: new Date(0),
        }),
      );

      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const orgs = user?.orgs;

    return {
      props: {
        orgs,
        currentUser,
      },
    };
  }
}

export default ConsoleHome;
