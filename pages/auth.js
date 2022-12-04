import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { info } from "@/lib/log";
import { useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/base/Input";
import { PrimaryButton } from "@/components/base/Buttons";
import { signIn, getSession, getCsrfToken } from "next-auth/react";

const Login = ({ csrfToken }) => {
  const { query } = useRouter();
  const [email, setEmail] = useState("");

  return (
    <>
      <Head>
        <title>Get started with Envless</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex h-screen flex-col justify-center px-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image
            className="mx-auto h-12 w-auto"
            height={100}
            width={100}
            src="/logo.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl">
            Get started with Envless
          </h2>

          <p className="mt-2 text-center text-sm text-light">
            Login or Sign up
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-2 py-8 sm:px-8">
            {query?.error === "OAuthAccountNotLinked" && (
              <div className="rounded-md bg-red-100 bg-opacity-10 p-4">
                <h3 className="ml-3 text-sm font-medium text-red-300">
                  To confirm your identify, continue with the same account you
                  used originally.
                </h3>
              </div>
            )}

            <form
              method="POST"
              className="space-y-6"
              action="/api/auth/signin/email"
            >
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="your@email.com"
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />

              <PrimaryButton sr="Send magic link">
                Send magic link
              </PrimaryButton>
            </form>

            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-darkest px-2 text-light">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <PrimaryButton
                  sr="Sign in with Github"
                  onClick={() => signIn("github")}
                >
                  <svg
                    className="h-5 w-5 text-light"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" />
                  </svg>
                  <span className="ml-2 inline-block">Github</span>
                </PrimaryButton>

                <PrimaryButton
                  sr="Sign in with Gitlab"
                  onClick={() => signIn("gitlab")}
                >
                  <svg
                    className="h-5 w-5 text-light"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M5.868 2.75L8 10h8l2.132-7.25a.4.4 0 0 1 .765-.01l3.495 10.924a.5.5 0 0 1-.173.55L12 22 1.78 14.214a.5.5 0 0 1-.172-.55L5.103 2.74a.4.4 0 0 1 .765.009z" />
                  </svg>

                  <span className="ml-2 inline-block">Gitlab</span>
                </PrimaryButton>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-light">
              By continuing, you agree to our{" "}
              <Link className="hover:text-gray-200" href="/terms">
                Terms of service
              </Link>{" "}
              and{" "}
              <Link className="hover:text-gray-200" href="/privacy">
                Privacy policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session) {
    info("Redirecting to dashboard");
    res.writeHead(301, { Location: "/console" });
    res.end();
  }

  return {
    props: {
      session,
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default Login;
