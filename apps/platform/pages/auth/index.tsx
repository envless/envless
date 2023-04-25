import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { getServerSideSession } from "@/utils/session";
import { Plus } from "lucide-react";
import { getCsrfToken, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { GithubFullIcon, GitlabFullIcon } from "@/components/icons";
import { Button, Input } from "@/components/theme";

const Login = ({ csrfToken }) => {
  const router = useRouter();
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    data = { ...data, callbackUrl: "/projects" };
    signIn("email", data);
    reset();
  };

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
            alt="Envless"
          />
          <h2 className="mt-6 text-center text-2xl">
            Get started with Envless
          </h2>

          <p className="text-light mt-2 text-center text-sm">
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
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }}
            >
              <Input
                name="csrfToken"
                type="hidden"
                register={register}
                defaultValue={csrfToken}
                full={true}
              />

              <Input
                name="email"
                type="email"
                label="Email address"
                placeholder="your@email.com"
                required={true}
                full={true}
                register={register}
                errors={errors}
                defaultValue="envless@example.com"
                validationSchema={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
              />

              <Button
                sr="Send magic link"
                type="submit"
                width="full"
                disabled={loading}
              >
                Send magic link
              </Button>
            </form>

            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-darkest text-light px-2">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  width="full"
                  onClick={() => signIn("github")}
                  disabled={loading}
                  sr="Sign in with Github"
                  variant="secondary"
                  leftIcon={
                    <GithubFullIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  }
                >
                  Github
                </Button>

                <Button
                  width="full"
                  onClick={() => signIn("gitlab")}
                  disabled={loading}
                  sr="Sign in with Github"
                  variant="secondary"
                  leftIcon={
                    <GitlabFullIcon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  }
                >
                  Gitlab
                </Button>
              </div>
            </div>

            <p className="text-light mt-8 text-center text-sm">
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

      <Toaster position="top-right" />
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
      session,
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default Login;
