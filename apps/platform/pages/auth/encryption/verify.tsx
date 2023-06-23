import { SessionUserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import type { Keychain, User } from "@prisma/client";
import VerifyEncryption from "@/components/auth/encryption/Verify";
import prisma from "@/lib/prisma";

type PageProps = {
  currentUser: User;
  keychain: Keychain;
};

const EncryptionDownloadPage = ({ currentUser, keychain }: PageProps) => {
  return <VerifyEncryption keychain={keychain} currentUser={currentUser} />;
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

  return {
    props: {
      currentUser,
      keychain,
    },
  };
}

export default EncryptionDownloadPage;