import { useState } from "react";
import { UserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import type { Keychain } from "@prisma/client";
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
  keychain: Keychain;
};

export default function VerifyAuth({
  sessionId,
  user,
  keychain,
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
            keychain={keychain}
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

  const hasPrivateKey = user.privateKey !== null;
  const hasMasterPassword = currentUser?.hashedPassword !== null;
  const keychain = currentUser?.keychain;

  let pageState = "";

  if (!hasMasterPassword) {
    pageState = "setupPassword";
  } else if (!hasPrivateKey) {
    pageState = "verifyPassword";
  } else {
    pageState = "verifyIdentify";
  }

  return {
    props: {
      user,
      pageState,
      sessionId,
      csrfToken,
      keychain,
      triggerSignout: !currentUser,
    },
  };
}
