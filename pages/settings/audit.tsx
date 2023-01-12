import SettingsLayout from "@/layouts/Settings";
import { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import Code from "@/components/theme/Code";
import Audit from "@/lib/audit";

type Props = {
  user: User;
  logs: any;
};

const AuditSettings: React.FC<Props> = ({ user, logs }) => {
  return (
    <SettingsLayout tab={"audit"} user={user}>
      <h3 className="text-lg">Audit log</h3>
      <Code code={JSON.stringify(logs, null, 2)} language="json" />
    </SettingsLayout>
  );
};

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });
  // @ts-ignore
  const userId = session?.user?.id;

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const audits = await Audit.logs({
    userId,
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(session.user)),
      logs: JSON.parse(JSON.stringify(audits)),
    },
  };
}

export default AuditSettings;
