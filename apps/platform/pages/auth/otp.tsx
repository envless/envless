import { SessionUserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import type { Keychain, User } from "@prisma/client";
import { getCsrfToken } from "next-auth/react";
import OneTimePassword from "@/components/auth/OneTimePassword";
import prisma from "@/lib/prisma";

type PageProps = {
  currentUser: User;
  csrfToken: string;
  keychain: Keychain;
};

const OtpPage = ({ currentUser, keychain, csrfToken }: PageProps) => {
  return (
    <OneTimePassword
      keychain={keychain}
      csrfToken={csrfToken}
      currentUser={currentUser}
    />
  );
};

export async function getServerSideProps(context) {
  const session = await getServerSideSession(context);
  const user = session?.user as SessionUserType;

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
  const csrfToken = await getCsrfToken(context);

  return {
    props: {
      keychain,
      csrfToken,
      currentUser,
    },
  };
}

export default OtpPage;
