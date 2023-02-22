import { type GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { addHours, isAfter } from "date-fns";
import { SubmitHandler, useForm } from "react-hook-form";
import { Hr } from "@/components/theme";
import { Button, Input, LoadingIcon } from "@/components/theme";
import prisma from "@/lib/prisma";

interface ProjectInviteForm {
  name: string;
  email: string;
  password: string;
}

const ProjectInvitePage = (props: {
  token: string;
  expired: boolean;
  accepted?: boolean;
  project?: { id: string; name: string };
}) => {
  const [complete, setComplete] = useState(false);
  const { token, expired, accepted, project } = props;

  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const acceptInviteMutation = trpc.members.acceptInvite.useMutation({
    onSuccess: (_data) => {
      setComplete(true);
    },

    onError: (error) => {
      setError("password", {
        type: "custom",
        message: error.message,
      });
    },
  });

  const acceptInvite: SubmitHandler<ProjectInviteForm> = async (data) => {
    const { name, email, password } = data;
    acceptInviteMutation.mutate({ token, name, email, password });
  };

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
          {expired || accepted ? (
            <>
              <h2 className="mt-6 text-center text-2xl">
                Invalid invite link!
              </h2>

              <p className="mt-2 text-center text-sm text-light">
                Please ask your project owner to send you a new invitation link.
              </p>
            </>
          ) : (
            <>
              {complete ? (
                <>
                  <h2 className="mt-6 text-center text-2xl">
                    You are good to go!
                  </h2>

                  <p className="mt-2 text-center text-sm text-light">
                    You have successfully accepted the invite, you can now join
                    the project after you have logged in.
                  </p>

                  <Button
                    href="/auth"
                    type="submit"
                    className={clsx("mt-10")}
                    full={true}
                  >
                    Go to login page
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="mt-6 text-center text-2xl">
                    Accept an invitation
                  </h2>

                  <p className="mt-2 text-center text-sm text-light">
                    Please enter your email address and one-time password to
                    join {project?.name || "the project"}.
                  </p>

                  <Hr className="my-8" />

                  <form onSubmit={handleSubmit(acceptInvite)}>
                    <Input
                      name="name"
                      type="text"
                      label="Your name"
                      required={true}
                      full={true}
                      register={register}
                      errors={errors}
                      validationSchema={{
                        required: "Name is required",
                      }}
                    />

                    <Input
                      name="email"
                      type="email"
                      label="Email address"
                      required={true}
                      full={true}
                      register={register}
                      errors={errors}
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
                      label="One-time password"
                      required={true}
                      full={true}
                      register={register}
                      errors={errors}
                      validationSchema={{
                        required: "One-time password is required",
                        pattern: {
                          value: /^[ A-Za-z0-9_@./#&+-]*$/,
                          message: "Invalid one-time password",
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      disabled={acceptInviteMutation.isLoading}
                      className={clsx(
                        "mt-10",
                        acceptInviteMutation.isLoading && "cursor-not-allowed",
                      )}
                      full={true}
                    >
                      {acceptInviteMutation.isLoading && (
                        <LoadingIcon className="h-4 w-4 text-dark" />
                      )}
                      Accept invitation
                    </Button>
                  </form>
                </>
              )}
            </>
          )}
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

    select: {
      invitationToken: true,
      createdAt: true,
      accepted: true,
      project: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  if (!invite) {
    return {
      props: {
        expired: true,
      },
    };
  }

  const expiresAt = addHours(invite.createdAt, 48);
  const expired = isAfter(new Date(), new Date(expiresAt));

  return {
    props: {
      token,
      expired,
      accepted: invite.accepted,
      project: invite.project,
    },
  };
}

export default ProjectInvitePage;
