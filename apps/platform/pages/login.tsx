import Head from "next/head";
import Link from "next/link";
import { getServerSideSession } from "@/utils/session";
import { getCsrfToken } from "next-auth/react";
import Session from "@/components/auth/Session";

const Login = ({ csrfToken }) => {
  const props = {
    page: "login",
    title: "Login to Envless",
    subtitle:
      process.env.NEXT_PUBLIC_SIGNUP_DISABLED != "true" ? (
        <>
          Don't have an account?{" "}
          <Link href="/signup" className="text-teal-400">
            Signup
          </Link>
        </>
      ) : (
        "Contact your admin, if you don't have an account."
      ),
    csrfToken: csrfToken,
  };

  return (
    <>
      <Head>
        <title>Get started with Envless</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Session {...props} />
    </>
  );
};

export async function getServerSideProps(context) {
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

export default Login;
