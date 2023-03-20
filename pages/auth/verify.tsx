import { useRouter } from "next/router";
import { useEffect } from "react";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { Container, EmptyState, LoadingIcon } from "@/components/theme";
import { getFingerprint } from "@/lib/fingerprint";
import log from "@/lib/log";

export default function VerifyAuth({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  const verifyMutation = trpc.auth.verify.useMutation({
    onSuccess: async (res: any) => {
      if (res.name === "TRPCError") {
        signOut();
        return;
      }

      router.push("/projects");
    },

    onError: (error) => {
      log("Error", error);
      signOut();
    },
  });

  useEffect(() => {
    (async () => {
      const fingerprint = await getFingerprint();
      await verifyMutation.mutate({ fingerprint, sessionId });
    })();
  }, []);

  return (
    <Container>
      <div className="mt-16">
        <EmptyState
          icon={<Shield className="m-3 mx-auto h-12 w-12" />}
          title={`Please wait...`}
          subtitle="While we verify your identity and your browser integrity."
        >
          <LoadingIcon className="h-6 w-6" />
        </EmptyState>
      </div>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSideSession(context);
  const sessionId = session?.id as string;

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionId,
    },
  };
}
