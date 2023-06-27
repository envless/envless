import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "@/utils/trpc";
import type { User } from "@prisma/client";
import { Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { Container } from "@/components/theme";
import { EmptyState, LoadingIcon } from "@/components/theme";
import { getFingerprint } from "@/lib/client";

const debug = require("debug")("envless:client");

type PageProps = {
  sessionId: string;
  user: User;
};

const VerifyBrowser = ({ sessionId, user }: PageProps) => {
  !user && signOut();
  const { name } = (user || {}) as any as User;
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
      debug("Error", error);
      signOut();
    },
  });

  useEffect(() => {
    const verify = async () => {
      const fingerprint = await getFingerprint();
      const params = {
        name,
        sessionId,
        fingerprint,
      };

      verifyMutation.mutate(params);
    };

    verify();
  });

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
};

export default VerifyBrowser;
