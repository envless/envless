import type { GetServerSidePropsContext } from "next";
import prisma from "@/lib/prisma";
import { getServerSideSession } from "./session";

const AUTH_ROUTES = {
  otp: "/auth/otp",
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

  const { temp, valid, present, downloaded } = user.keychain;

  if (present && temp && url !== AUTH_ROUTES.otp) {
    return {
      redirect: {
        destination: AUTH_ROUTES.otp,
        permanent: false,
      },
    };
  }

  if ((!present || temp || !downloaded) && url !== AUTH_ROUTES.download) {
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
      hashedPassword: true,
    },
  });

  const keychain = await prisma.keychain.findUnique({
    where: { userId: user?.id },
    select: {
      id: true,
      publicKey: true,
      revocationCertificate: true,
      verificationString: true,
      tempEncryptedPrivateKey: true,
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
