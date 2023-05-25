import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import { signOut } from "next-auth/react";
import { getCsrfToken } from "next-auth/react";
import KeychainSetup from "@/components/auth/KeychainSetup";
import MasterPassword from "@/components/auth/MasterPassword";
import VerifyBrowser from "@/components/auth/VerifyBrowser";
import { Container } from "@/components/theme";
import { getFingerprint } from "@/lib/client";
import log from "@/lib/log";

type PageProps = {
  sessionId: string;
  user: UserType;
  pageState: string;
  csrfToken: string;
};

export default function VerifyAuth({
  sessionId,
  user,
  pageState,
  csrfToken,
}: PageProps) {
  const router = useRouter();
  const [page, setPage] = useState(pageState);

  const verifyMutation = trpc.auth.verifyBrowser.useMutation({
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

  return (
    <Container>
      <div className="mt-16">
        {page === "verifyIdentify" && <VerifyBrowser />}
        {page === "resetPassword" && (
          <MasterPassword
            csrfToken={csrfToken}
            reset={true}
            user={user}
            setPage={setPage}
          />
        )}
        {page === "setupPassword" && (
          <MasterPassword csrfToken={csrfToken} user={user} setPage={setPage} />
        )}
        {page === "setupKeychain" && (
          <KeychainSetup csrfToken={csrfToken} user={user} setPage={setPage} />
        )}
      </div>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSideSession(context);
  const sessionId = session?.id as string;
  const user = session?.user as UserType;
  const csrfToken = await getCsrfToken(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let pageState;

  if (!user.hasMasterPassword) {
    pageState = "setupPassword";
  } else if (!user.keychain?.temp) {
    pageState = "resetPassword";
  } else if (!user.keychain) {
    pageState = "setupKeychain";
  } else {
    pageState = "verifyIdentify";
  }

  return {
    props: {
      user,
      pageState,
      sessionId,
      csrfToken,
    },
  };
}
