import type { GetServerSidePropsContext } from "next";
import { SessionUserType } from "@/types/resources";
import getAuthPageProps from "@/utils/getAuthPageProps";
import type { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import VerifyBrowser from "@/components/auth/VerifyBrowser";

type PageProps = {
  currentUser: User;
  session: SessionUserType;
};

export default function EncryptionPage({ session, currentUser }: PageProps) {
  !currentUser && signOut();
  return <VerifyBrowser sessionId={session.id} user={currentUser} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const props = await getAuthPageProps(context);
  return props;
}
