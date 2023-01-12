import SettingsLayout from "@/layouts/Settings";
import { User } from "@prisma/client";
import { getSession } from "next-auth/react";

type Props = {
  user: User;
};

const AccountSettings: React.FC<Props> = ({ user }) => {
  return (
    <SettingsLayout tab={"general"} user={user}>
      <h3 className="text-lg">Account settings</h3>
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
