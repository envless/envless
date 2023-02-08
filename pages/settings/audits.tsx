import { type GetServerSidePropsContext } from "next";
import { Fragment, useState } from "react";
import SettingsLayout from "@/layouts/Settings";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import AuditLogs from "@/components/projects/AuditLogs";
import { Button } from "@/components/theme";
import Audit from "@/lib/audit";

interface AuditSettingsProps {
  user: User;
}

const AuditSettings = ({ user }: AuditSettingsProps) => {
  const [page, setPage] = useState(0);
  const {
    data: auditLogs,
    fetchNextPage,
    isLoading,
    status,
    isFetchingNextPage,
    hasNextPage
  } = trpc.audits.paginate.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <SettingsLayout tab={"audit"} user={user}>
      <h3 className="mb-8 text-lg ">Audit logs</h3>

      <div className="w-full lg:w-3/5">
        {isLoading ? (
          "loading..."
        ) : (
            auditLogs?.pages.map((page, index) => (
              <Fragment key={index}>
                <AuditLogs logs={page.logs} user={user} />
              </Fragment>
            ))
        )}
        <Button
          small={true}
          secondary={true}
          className="mt-8"
          disabled={isFetchingNextPage || !hasNextPage}
          onClick={() => {
            fetchNextPage();
          }}
        >
          {isFetchingNextPage ?  'Loading...': hasNextPage ? 'Load More': 'Nothing to load'} 
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

  return {
    props: {
      user: JSON.parse(JSON.stringify(session.user)),
    },
  };
}

export default AuditSettings;
