import Head from "next/head";
import Image from "next/image";
import TwoFactorForm from "@/components/TwoFactorForm";
import { Hr } from "@/components/theme";

const TwoFactorAuth = () => {
  return (
    <>
      <Head>
        <title>Two-factor authentication</title>
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
          <h2 className="mt-6 text-center text-2xl">
            Two-factor authentication
          </h2>
          <p className="mt-2 text-center text-sm text-light">
            Two factor authentication is required to continue. Please enter the
            code from your authenticator app.
          </p>
          <Hr className="my-8" />

          <TwoFactorForm
            onConfirm={() => {
              // redirect users to /projects
              console.log("2fa confirmed on the page, redirecting...");
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TwoFactorAuth;
