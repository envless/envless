import type { GetServerSidePropsContext } from "next";
import getAuthPageProps from "@/utils/getAuthPageProps";
import type { Keychain, User } from "@prisma/client";
import { signOut } from "next-auth/react";
import DownloadPrivateKey from "@/components/encryption/Download";

type PageProps = {
  currentUser: User;
  keychain: Keychain;
};

const EncryptionDownloadPage = ({ currentUser, keychain }: PageProps) => {
  !currentUser && signOut();

  return <DownloadPrivateKey keychain={keychain} currentUser={currentUser} />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const props = await getAuthPageProps(context);
  return props;
}

export default EncryptionDownloadPage;
