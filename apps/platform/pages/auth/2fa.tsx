import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Hr } from "@/components/theme";
import TwoFactorForm from "@/components/twoFactorForm";
import log from "@/lib/log";

const TwoFactorAuth = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Two-factor authentication</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex h-screen flex-col justify-center px-12">
        <div className="bg-darker rounded p-10 sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto h-12 w-auto"
            height={100}
            width={100}
            src="/logo.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl">
            Two-factor authentication
          </h2>
          <p className="text-light mt-2 text-center text-sm">
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
        </div>
      </div>
    </>
  );
};

export default TwoFactorAuth;
