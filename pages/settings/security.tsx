import Link from "next/link";
import { useState, useEffect } from "react";
import prisma from "@/lib/prisma";
import QRCode from "react-qr-code";
import { trpc } from "@/utils/trpc";
import { User } from "@prisma/client";
import { authenticator } from "otplib";
import { getSession } from "next-auth/react";
import SettingsLayout from "@/layouts/Settings";
import { TwoFactorAuth } from "@/utils/interfaces";
import { Encrypted, Decrypted } from "@/lib/crypto";
import { useForm, SubmitHandler } from "react-hook-form";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Paragraph, Input, Button, Modal } from "@/components/theme";

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
      <h3 className="text-lg">
        Two factor authentication
        {enabled ? (
          <span className="ml-5 mr-1 inline-block rounded-full bg-teal-200 py-[2px] px-2 text-xs uppercase text-teal-600 last:mr-0">
            enabled
          </span>
        ) : (
          <span className="ml-5 mr-1 inline-block rounded-full bg-red-200 py-[2px] px-2 text-xs uppercase text-red-600 last:mr-0">
            disabled
          </span>
        )}
      </h3>
      <Paragraph color="light" size="sm" className="mb-4">
        Two factor authentication adds an extra layer of security to your
        account by requiring an OTP code when you login using new device or
        browser.
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
            <Button outline={true}>Activate two-factor authentication</Button>
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
    </SettingsLayout>
  );
};

export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const currentUser = session.user;
    let user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        id: currentUser.id,
      },
      select: {
        email: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
      },
    });

    if (!user?.twoFactorEnabled) {
      const secret = await authenticator.generateSecret(20);
      const encryptedSecret = await Encrypted(
        secret,
        String(process.env.ENCRYPTION_KEY),
      );

      // @ts-ignore
      user = await prisma.user.update({
        where: {
          // @ts-ignore
          id: currentUser.id,
        },
        data: {
          twoFactorSecret: encryptedSecret,
        },

        select: {
          email: true,
          twoFactorEnabled: true,
          twoFactorSecret: true,
        },
      });
    }

    let twoFactor = {
      keyUri: "",
      secret: "",
      enabled: user?.twoFactorEnabled,
    };

    if (!user?.twoFactorEnabled) {
      const decryptedSecret = await Decrypted(
        // @ts-ignore
        user?.twoFactorSecret,
        String(process.env.ENCRYPTION_KEY),
      );

      const keyUri = authenticator.keyuri(
        user?.email,
        "envless.dev",
        decryptedSecret,
      );

      twoFactor = {
        ...twoFactor,
        secret: decryptedSecret,
        keyUri: keyUri,
      };
    }

    return {
      props: {
        twoFactor,
        user: JSON.parse(JSON.stringify(currentUser)),
      },
    };
  }
}

export default SecuritySettings;
