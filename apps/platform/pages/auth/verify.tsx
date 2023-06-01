import { useState } from "react";
import { UserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import { getCsrfToken } from "next-auth/react";
import { signOut } from "next-auth/react";
import MasterPassword from "@/components/auth/MasterPassword";
import VerifyBrowser from "@/components/auth/VerifyBrowser";
import { Container } from "@/components/theme";
import prisma from "@/lib/prisma";

type PageProps = {
  sessionId: string;
  user: UserType;
  pageState: string;
  csrfToken: string;
  triggerSignout: boolean;
};

export default function VerifyAuth({
  sessionId,
  user,
  pageState,
  csrfToken,
  triggerSignout,
}: PageProps) {
  const [page, setPage] = useState(pageState);

  if (triggerSignout) {
    signOut();
  }

  return (
    <Container>
      <div className="mt-16">
        {page === "verifyBrowser" ? (
          <VerifyBrowser sessionId={sessionId} user={user} />
        ) : (
          <MasterPassword
            user={user}
            page={page}
            setPage={setPage}
            csrfToken={csrfToken}
          />
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

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { keychain: true },
  });

  const hasPrivateKey = user.keychain?.privateKey;
  const hasTempKeychain = currentUser?.keychain?.temp ?? false;
  const hasMasterPassword = currentUser?.hashedPassword !== null;
  const hasKeychain = currentUser?.keychain !== null && user.keychain;

  let pageState;

  if (!hasMasterPassword) {
    pageState = "setupPassword";
  } else if (hasMasterPassword && hasTempKeychain) {
    pageState = "setupPasswordForInvitedUser";
  } else if (!hasKeychain || !hasPrivateKey) {
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
      triggerSignout: !currentUser,
    },
  };
}
