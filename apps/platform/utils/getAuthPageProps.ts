import type { GetServerSidePropsContext } from "next";
import prisma from "@/lib/prisma";
import { getServerSideSession } from "./session";

const AUTH_ROUTES = {
  root: "/auth/verify",
  download: "/encryption/download",
  verify: "/encryption/verify",
};

const getAuthPageProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSideSession(context);
  const user = session?.user;
  const url = context.resolvedUrl;

  if (!session || !user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { valid, present, downloaded } = user.keychain;

  if (!downloaded && url !== AUTH_ROUTES.download) {
    return {
      redirect: {
        destination: AUTH_ROUTES.download,
        permanent: false,
      },
    };
  }

  if (present && downloaded && !valid && url !== AUTH_ROUTES.verify) {
    return {
      redirect: {
        destination: AUTH_ROUTES.verify,
        permanent: false,
      },
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: user?.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
    },
  });

  const keychain = await prisma.keychain.findUnique({
    where: { userId: user?.id },
    select: {
      id: true,
      publicKey: true,
      revocationCertificate: true,
      verificationString: true,
      downloaded: true,
    },
  });

  return {
    props: {
      session: session,
      currentUser,
      keychain,
    },
  };
};

export default getAuthPageProps;
