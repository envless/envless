import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { getServerSideSession } from "@/utils/session";
import clsx from "clsx";
import jsrp from "jsrp";
import { getCsrfToken } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import zxcvbn from "zxcvbn";
import { Button, Input } from "@/components/theme";

const Signup = ({ csrfToken }) => {
  const router = useRouter();
  const { query } = useRouter();
  const client = new jsrp.client();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordHelper, setPasswordHelper] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // setLoading(true);
    data = { ...data, callbackUrl: "/projects" };
    const { email, password } = data;
    
    client.init({
      username: email,
      password,
    }, () => {
      client.createVerifier(async (error, result) => {
        if (error) {
          setLoading(false);
          return;
        }

        const { salt, verifier } = result;

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            salt,
            verifier,
          }),
        });
      })
    });

    // const res = await fetch("/api/auth/signup", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     email,
    //     passwordSalt
    //   }),
    // });

    // if (res.status === 200) {
    //   debounce(() => {
    //     router.reload();
    //   }, 3000)();
    // } else {
    //   const json = await res.json();
    //   if (json?.error) {
    //     log("error", json.error);
    //   }
    // }
    // reset();
  };

  const secondsToString = (seconds: number) => {
    const numyears = Math.floor(seconds / 31536000);
    const numdays = Math.floor((seconds % 31536000) / 86400);
    const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;

    if (numyears > 100) return "centuries";
    if (numyears > 10) return "decades";
    if (numyears > 0) return `about ${numyears} years`;
    if (numdays > 0) return `less than ${numdays} days`;
    if (numhours > 0) return `less than ${numhours} hours`;
    if (numminutes > 0) return `less than ${numminutes} minutes`;
    if (numseconds > 0) return `less than ${numseconds} seconds`;
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
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl">
            Get started with Envless
          </h2>
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

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                defaultValue="envless.dev@example.com"
                validationSchema={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
              />

              <Input
                name="password"
                type="password"
                label="Master password"
                required={true}
                full={true}
                register={register}
                errors={errors}
                defaultValue="envless.dev@example.com1A"
                validationSchema={{
                  required: "Password is required",
                  minLength: {
                    value: 12,
                    message: "Password must be at least 12 characters",
                  },
                  maxLength: {
                    value: 128,
                    message: "Password must be at most 128 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
                  },
                }}
                onKeyUp={(e) => {
                  const inputPassword = e.target.value;

                  if (inputPassword.length === 0) {
                    setPasswordHelper("");
                  } else {
                    const result = zxcvbn(inputPassword);
                    const seconds =
                      result.crack_times_seconds.online_throttling_100_per_hour;
                    const humanized = secondsToString(seconds / 120) as string;
                    setPassword(inputPassword);
                    setPasswordScore(result.score);
                    setPasswordHelper(humanized);

                    if (passwordScore >= 3) {
                      setLoading(false);
                    } else {
                      setLoading(true);
                    }
                    console.log(
                      "Score",
                      passwordScore,
                      "Loading status",
                      loading,
                    );
                  }
                }}
              />

              {password.length > 1 && (
                <div className="flex h-1 w-full overflow-hidden rounded-full bg-dark">
                  <div
                    className={clsx(
                      passwordScore === 0 && "bg-red-400",
                      passwordScore === 1 && "bg-orange-400",
                      passwordScore === 2 && "bg-yellow-400",
                      passwordScore === 3 && "bg-lime-400",
                      passwordScore === 4 && "bg-teal-400",
                      "flex flex-col justify-center overflow-hidden",
                    )}
                    role="progressbar"
                    style={{
                      width: `${(passwordScore + 1) * 20}%`,
                    }}
                  ></div>
                </div>
              )}

              {passwordHelper && (
                <p className="-mt-10 text-xs text-light">
                  Time to hack:{" "}
                  <span className="text-lighter">{passwordHelper}</span>
                </p>
              )}

              <Button
                sr="Signup button"
                type="submit"
                width="full"
                disabled={loading}
              >
                Create an account
              </Button>
            </form>

            <p className="mt-8 text-xs text-light">
              By continuing, you agree to our{" "}
              <Link className="underline hover:text-gray-200" href="/terms">
                Terms of service
              </Link>{" "}
              and{" "}
              <Link className="underline hover:text-gray-200" href="/privacy">
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

export default Signup;
