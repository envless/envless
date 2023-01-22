import SettingsLayout from "@/layouts/Settings";
import { User } from "@prisma/client";
import AuditLogs from "@/components/projects/AuditLogs";
import { Button } from "@/components/theme";
import Audit from "@/lib/audit";
import { getServerAuthSession } from "@/utils/get-server-auth-session";
import { type GetServerSidePropsContext } from "next";

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
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
