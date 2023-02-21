import log from "@/lib/log";
import Head from "next/head";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";
import { Hr } from "@/components/theme";
import TwoFactorForm from "@/components/twoFactorForm";
import { type GetServerSidePropsContext } from "next";
import { type ProjectInvite } from "@prisma/client";

const ProjectInvitePage = (expired: boolean) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Accept Invitation</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex h-screen flex-col justify-center px-12">
        <div className="rounded bg-darker p-10 sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto h-12 w-auto"
            height={100}
            width={100}
            src="/logo.png"
            alt="Your Company"
          />

          {
            expired == true ? (
              <>
                <h2 className="mt-6 text-center text-2xl">
                  Invalid Invitation
                </h2>
                <p className="mt-2 text-center text-sm text-light">
                  Two factor authentication is required to continue. Please enter the
                  code from your authenticator app.
                </p>
                <Hr className="my-8" />

                <TwoFactorForm
                  onConfirm={() => {
                    log("2fa confirmed on the page, redirecting...");
                    router.push("/projects");
                  }}
                />
              </>
              ) : (
              <>
                <h2 className="mt-6 text-center text-2xl">
                  Accept Invitation
                </h2>
                <p className="mt-2 text-center text-sm text-light">
                  Two factor authentication is required to continue. Please enter the
                  code from your authenticator app.
                </p>
                <Hr className="my-8" />

                <TwoFactorForm
                  onConfirm={() => {
                    log("2fa confirmed on the page, redirecting...");
                    router.push("/projects");
                  }}
                />
              </>
            )
          }
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // @ts-ignore
  const { token } = context.params;
  const invite = await prisma.projectInvite.findFirst({
    where: {
      invitationToken: token,
    },
  })

  if(!invite) {
    return {
      props: {
        expired: true,
      },
    }
  }

  const expired = new Date(invite.expires).getTime() <= Date.now();

  return {
    props: {
      expired
    },
  }
}

export default ProjectInvitePage;
