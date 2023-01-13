import SettingsLayout from "@/layouts/Settings";
import { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import AuditLogs from "@/components/projects/AuditLogs";
import { Button } from "@/components/theme";
import Audit from "@/lib/audit";

interface AuditSettingsProps {
  user: User;
  logs: any;
}

const AuditSettings = ({ user, logs }: AuditSettingsProps) => {
  return (
    <SettingsLayout tab={"audit"} user={user}>
      <h3 className="mb-8 text-lg ">Audit logs</h3>
      <AuditLogs logs={logs} user={user} />
      <Button
        small={true}
        outline={true}
        className="mt-8"
        href="/settings/audit"
      >
        Load more
      </Button>
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

  const access = await prisma?.access.findMany({
    where: { userId },
    select: { projectId: true },
  });

  const projectIds = access?.map((e) => e.projectId);
  const logs = await Audit.logs({ projectId: projectIds });

  return {
    props: {
      user: JSON.parse(JSON.stringify(session.user)),
      logs: JSON.parse(JSON.stringify(logs)),
    },
  };
}

export default AuditSettings;
