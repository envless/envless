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

      <div className="w-full lg:w-3/5">
        <AuditLogs logs={logs} user={user} />
        <Button
          small={true}
          outline={true}
          className="mt-8"
          href="/settings/audits"
        >
          Load more
        </Button>
      </div>
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
  const logs = await Audit.logs({
    createdById: userId,
    actions: ["updated.account"],
    projectIds: projectIds,
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(session.user)),
      logs: JSON.parse(JSON.stringify(logs)),
    },
  };
}

export default AuditSettings;
