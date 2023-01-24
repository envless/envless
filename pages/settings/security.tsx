import Link from "next/link";
import prisma from "@/lib/prisma";
import QRCode from "react-qr-code";
import { trpc } from "@/utils/trpc";
import { User } from "@prisma/client";
import { authenticator } from "otplib";
import { useEffect, useState } from "react";
import SettingsLayout from "@/layouts/Settings";
import { TwoFactorAuth } from "@/utils/interfaces";
import { decrypt, encrypt } from "@/lib/encryption";
import { type GetServerSidePropsContext } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button, Input, Modal, Paragraph } from "@/components/theme";
import { getServerAuthSession } from "@/utils/get-server-auth-session";

type Props = {
  user: User;
  twoFactor: {
    keyUri: string;
    secret: string;
    enabled: boolean;
  };
};

const SecuritySettings: React.FC<Props> = ({ user, twoFactor }) => {
  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(twoFactor.enabled);

  useEffect(() => {
    setEnabled(twoFactor.enabled);
  }, [twoFactor.enabled]);

  const enableMutation = trpc.twoFactor.enable.useMutation({
    onSuccess: (_data) => {
      setLoading(false);
      setEnabled(true);
    },

    onError: (error) => {
      setLoading(false);
      setEnabled(false);

      setError("code", {
        type: "custom",
        message: error.message,
      });
    },
  });

  const disableMutation = trpc.twoFactor.disable.useMutation({
    onSuccess: () => {
      setLoading(false);
      setEnabled(false);
    },

    onError: (error) => {
      setLoading(false);
      console.log("Error while disabling 2fa", error);
    },
  });

  const verifyOtp: SubmitHandler<TwoFactorAuth> = async (data) => {
    const { code } = data;
    enableMutation.mutate({ code: code });
    reset();
    setLoading(true);
  };

  return (
    <SettingsLayout tab={"security"} user={user}>
      <h3 className="mb-8 text-lg">
        Two factor authentication
        {enabled ? (
          <span className="ml-5 mr-1 inline-block rounded-full bg-teal-200 py-[2px] px-2 text-xs text-teal-600 last:mr-0">
            Enabled
          </span>
        ) : (
          <span className="ml-5 mr-1 inline-block rounded-full bg-red-200 py-[2px] px-2 text-xs text-red-600 last:mr-0">
            Not enabled
          </span>
        )}
      </h3>
      <div className="w-full lg:w-3/5">
        <Paragraph color="light" size="sm" className="mb-4 w-full">
          Two factor authentication adds an extra layer of security to your
          account by requiring a code when you login using new device or browser
          and make critical changes.
        </Paragraph>

        {enabled ? (
          <Button
            outline={true}
            onClick={() => {
              disableMutation.mutate();
            }}
            disabled={loading}
          >
            <span className="text-red-400">
              Disable two-factor authentication
            </span>
          </Button>
        ) : (
          <Modal
            button={
              <Button outline={true}>Enable two-factor authentication</Button>
            }
            title="Activate two-factor authentication"
          >
            <Paragraph color="light" size="sm" className="mb-4 text-center">
              Please scan the QR code below with your favorite{" "}
              <Link
                href="https://www.nytimes.com/wirecutter/reviews/best-two-factor-authentication-app/"
                target="_blank"
                rel="noreferrer"
                className="text-lighter"
              >
                two-factor authentication app
              </Link>{" "}
              and then confirm the code below. For mannual setup, you can
              copy/paste this code
            </Paragraph>
            <Paragraph color="light" size="sm" className="m-5 text-center">
              <code
                className="cursor-copy rounded bg-dark py-1 px-2 font-mono text-xs tracking-wider text-lightest"
                onClick={() => {
                  navigator.clipboard.writeText(`${twoFactor.secret}`);
                }}
              >
                {twoFactor.secret}
              </code>
            </Paragraph>

            <div className="flex flex-wrap">
              <div className="mt-4 w-1/2 md:mb-0">
                <QRCode
                  size={175}
                  style={{ height: "175px", maxWidth: "75%", width: "75%" }}
                  value={twoFactor.keyUri}
                  bgColor={"#000000"}
                  fgColor={"#e4e4e4"}
                />
              </div>

              <div className="w-1/2 md:mb-0">
                <form onSubmit={handleSubmit(verifyOtp)}>
                  <Input
                    type="text"
                    name="code"
                    inputMode="numeric"
                    label="Two-factor auth code"
                    placeholder="xxxxxx"
                    required={true}
                    full={true}
                    register={register}
                    errors={errors}
                    help="Enter the six-digit code from your authenticator app."
                    validationSchema={{
                      required: "Two-factor authentication code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Invalid two-factor authentication code",
                      },
                    }}
                  />

                  <div className="float-right">
                    <Button type="submit" disabled={loading}>
                      Verify and continue
                      <ArrowRightIcon
                        className="ml-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </SettingsLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const sessionUser = session.user;
    let user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        id: sessionUser.id,
      },
      select: {
        email: true,
        twoFactor: true,
        twoFactorEnabled: true,
      },
    });

    if (!user?.twoFactorEnabled) {
      const secret = await authenticator.generateSecret(20);
      const encryptedSecret = await encrypt({
        plaintext: secret,
        key: String(process.env.ENCRYPTION_KEY),
      });

      // @ts-ignore
      user = await prisma.user.update({
        where: {
          // @ts-ignore
          id: sessionUser.id,
        },
        data: {
          twoFactor: encryptedSecret,
        },

        select: {
          email: true,
          twoFactor: true,
          twoFactorEnabled: true,
        },
      });
    }

    let twoFactor = {
      keyUri: "",
      secret: "",
      enabled: user?.twoFactorEnabled,
    };

    if (!user?.twoFactorEnabled) {
      const encrypted = Object.assign({}, user?.twoFactor) as {
        ciphertext: string;
        iv: string;
        tag: string;
      };

      const decrypted = await decrypt({
        ...encrypted,
        key: String(process.env.ENCRYPTION_KEY),
      });

      const keyUri = authenticator.keyuri(
        user?.email,
        "envless.dev",
        decrypted,
      );

      twoFactor = {
        ...twoFactor,
        secret: decrypted,
        keyUri: keyUri,
      };
    }

    return {
      props: {
        twoFactor,
        user: JSON.parse(JSON.stringify(sessionUser)),
      },
    };
  }
}

export default SecuritySettings;
