import Head from "next/head";
import Link from "next/link";
import { getServerSideSession } from "@/utils/session";
import { getCsrfToken } from "next-auth/react";
import Session from "@/components/auth/Session";

const Signup = ({ csrfToken }) => {
  return (
    <>
      <Head>
        <title>Get started with Envless</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Session
        page="signup"
        title="Get started with Envless"
        subtitle={
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-teal-400">
              Login
            </Link>
          </>
        }
        csrfToken={csrfToken}
      />
    </>
  );
};

export async function getServerSideProps(context) {
  if (process.env.NEXT_PUBLIC_SIGNUP_DISABLED === "true") {
    return { notFound: true };
  }

  const { res } = context;
  const session = await getServerSideSession(context);

  if (session) {
    res.writeHead(301, { Location: "/projects" });
    res.end();
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default Signup;
