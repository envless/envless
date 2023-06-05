import { useState } from "react";
import { UserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import type { Keychain } from "@prisma/client";
import { getCsrfToken } from "next-auth/react";
import { signOut } from "next-auth/react";
import EncryptionSetup from "@/components/auth/EncryptionSetup";
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

export default function EncryptionPage({
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
        {page === "verifyIdentify" ? (
          <VerifyBrowser sessionId={sessionId} user={user} />
        ) : (
          <EncryptionSetup
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
    include: {
      keychain: {
        select: {
          temp: true,
          encryptedPrivateKey: true,
        },
      },
    },
  });

  const hasPrivateKey = user.privateKey !== null;
  const keychain = currentUser?.keychain || null;

  let pageState = "";

  if (!hasPrivateKey) {
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
      keychain,
      triggerSignout: !currentUser,
    },
  };
}
