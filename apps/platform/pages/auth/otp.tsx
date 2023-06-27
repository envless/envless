import type { GetServerSidePropsContext } from "next";
import getAuthPageProps from "@/utils/getAuthPageProps";
import type { Keychain, User } from "@prisma/client";
import { signOut } from "next-auth/react";
import OneTimePassword from "@/components/auth/OneTimePassword";

type PageProps = {
  currentUser: User;
  csrfToken: string;
  keychain: Keychain;
  triggerSignout: boolean;
};

const OtpPage = ({ currentUser, keychain, csrfToken }: PageProps) => {
  !currentUser && signOut();

  return (
    <OneTimePassword
      keychain={keychain}
      csrfToken={csrfToken}
      currentUser={currentUser}
    />
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const props = await getAuthPageProps(context);
  return props;
}

export default OtpPage;
