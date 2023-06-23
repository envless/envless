import { useState } from "react";
import { SessionUserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import type { Keychain, User } from "@prisma/client";
import { getCsrfToken } from "next-auth/react";
import { signOut } from "next-auth/react";
import EncryptionSetup from "@/components/auth/EncryptionSetup";
import VerifyBrowser from "@/components/auth/VerifyBrowser";
import { Container } from "@/components/theme";
import prisma from "@/lib/prisma";

type PageProps = {
  sessionId: string;
  currentUser: User;
  pageState: string;
  csrfToken: string;
  triggerSignout: boolean;
  keychain: Keychain;
};

export default function EncryptionPage({
  sessionId,
  currentUser,
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
          <VerifyBrowser sessionId={sessionId} user={currentUser} />
        ) : (
          <EncryptionSetup
            user={currentUser}
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
  const user = session?.user as SessionUserType;
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
    select: {
      id: true,
      name: true,
      email: true,
      hashedPassword: true,
      keychain: {
        select: {
          publicKey: true,
          verificationString: true,
        },
      },
    },
  });

  const keychain = currentUser?.keychain || null;
  const hasPrivateKey = user.privateKey !== null;
  const isPrivateKeyValid = user.isPrivateKeyValid;
  const hasTempPrivateKey = user.tempEncryptedPrivateKey !== null;

  let pageState = "";

  if (!keychain) {
    pageState = "createKeychain";
  } else if (keychain && hasTempPrivateKey) {
    pageState = "verifyOneTimePassword";
  } else if (keychain && hasPrivateKey && isPrivateKeyValid) {
    pageState = "verifyIdentify";
  } else {
    pageState = "verifyKeychain";
  }

  return {
    props: {
      currentUser,
      pageState,
      sessionId,
      csrfToken,
      keychain,
      triggerSignout: !currentUser,
    },
  };
}
