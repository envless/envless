import dynamic from "next/dynamic";
import { UserType } from "@/types/resources";
import { getServerSideSession } from "@/utils/session";
import { format } from "date-fns";
import prisma from "@/lib/prisma";

const PdfDocument = dynamic(() => import("@/components/auth/EncryptionPdf"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

type PageProps = {
  user: UserType;
  privateKey: string;
  createdOn: string;
};

export default function EncryptionPage({
  user,
  createdOn,
  privateKey,
}: PageProps) {
  const name = user.name || ("You" as string);
  return (
    <PdfDocument name={name} privateKey={privateKey} createdOn={createdOn} />
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSideSession(context);
  const user = session?.user as UserType;
  const privateKey = user?.privateKey;

  if (!session || !user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const keychain = await prisma.keychain.findUnique({
    where: {
      userId: user.id,
    },

    select: {
      createdAt: true,
    },
  });

  if (!privateKey || !keychain) {
    return {
      redirect: {
        destination: "/auth/encryption",
        permanent: false,
      },
    };
  }

  const createdOn = format(keychain.createdAt, "MMM dd, yyyy 'at' h:mm a");

  return {
    props: {
      user,
      createdOn,
      privateKey,
    },
  };
}
