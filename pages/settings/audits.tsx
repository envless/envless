import { type GetServerSidePropsContext } from "next";
import SettingsLayout from "@/layouts/Settings";
import { getServerSideSession } from "@/utils/session";
import { User } from "@prisma/client";
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
        <Button small={true} secondary={true} className="mt-8">
          Load More
        </Button>
      </div>
    </SettingsLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
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
    actions: ["account.updated"],
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
