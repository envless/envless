import { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import SettingsLayout from "@/layouts/Settings";

type Props = {
  user: User;
};

const AccountSettings: React.FC<Props> = ({ user }) => {
  return (
    <SettingsLayout tab={"general"} user={user}>
      <h2>Account settings</h2>
    </SettingsLayout>
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

export default AccountSettings;
