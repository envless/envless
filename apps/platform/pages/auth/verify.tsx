import { useState } from "react";
import { UserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import type { Keychain, User } from "@prisma/client";
import { signOut } from "next-auth/react";
import VerifyBrowser from "@/components/auth/VerifyBrowser";
import prisma from "@/lib/prisma";

type PageProps = {
  sessionId: string;
  currentUser: User;
  triggerSignout: boolean;
  keychain: Keychain;
};

export default function EncryptionPage({
  sessionId,
  currentUser,
  keychain,
  triggerSignout,
}: PageProps) {
  if (triggerSignout) {
    signOut();
  }

  return <VerifyBrowser sessionId={sessionId} user={currentUser} />;
}

export async function getServerSideProps(context) {
  const session = await getServerSideSession(context);
  const sessionId = session?.id as string;
  const user = session?.user as UserType;

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

  return {
    props: {
      keychain,
      sessionId,
      currentUser,
      triggerSignout: !currentUser,
    },
  };
}
