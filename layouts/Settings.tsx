import { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Tabs from "@/components/settings/Tabs";
import { Container, Hr, Nav } from "@/components/theme";

type Props = {
  user: User;
  tab?: string;
  children: React.ReactNode;
};

const Settings: React.FC<Props> = ({ tab, user, children }) => {
  const options = [
    {
      id: "account",
      name: "Account",
      href: "/settings",
    },
    {
      id: "security",
      name: "Security",
      href: "/settings/security",
    },
    {
      id: "audit",
      name: "Audit logs",
      href: "/settings/audits",
    },
  ];

  return (
    <>
      <Container>
        <Nav user={user} layout="Settings" />
      </Container>

      <Hr />

      <Container>
        <div className="my-12 flex flex-wrap">
          <div className="mb-4 w-full px-4 md:mb-0 md:w-1/2 lg:w-1/3">
            <Tabs active={tab} options={options} />
          </div>

          <div className="mb-4 w-full px-4 md:mb-0 md:w-1/2 lg:w-2/3">
            {children}
          </div>
        </div>
      </Container>

      <Toaster position="top-right" />
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
    return {
      props: {
        user: JSON.parse(JSON.stringify(session.user)),
      },
    };
  }
}

export default Settings;
