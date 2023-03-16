import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { getServerSideSession } from "@/utils/session";
import clsx from "clsx";
import { ArrowRight, Clipboard, ClipboardCheck } from "lucide-react";
import { Encryption as EncryptionIcon } from "@/components/icons";
import { Banner } from "@/components/theme";
import { Button, TextareaGroup } from "@/components/theme";
import { generateKeyPair } from "@/lib/encryption/asymmetric";
import prisma from "@/lib/prisma";

export default function Encryption({ publicKey }: { publicKey: string }) {
  const router = useRouter();
  const [masked, setMasked] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hasKey, setHasKey] = useState(!!publicKey);
  const [secretKey, setSecretKey] = useState("");
  const [maskedSecretKey, setMaskedSecretKey] = useState("");
  const [clientPublicKey, setClientPublicKey] = useState(publicKey || "");

  const getBrowserSecretKey = async () => {
    const browserSecretKey = sessionStorage.getItem("secretKey") || "";
    setSecretKey(browserSecretKey);
  };

  const setBrowserSecretKey = async (secret) => {
    setSecretKey(secret);
    sessionStorage.setItem("secretKey", secret);
  };

  const generateAndSetKeys = async () => {
    const keyPair = await generateKeyPair();
    sessionStorage.setItem("secretKey", keyPair.secretKey);
    setClientPublicKey(keyPair.publicKey);
    setSecretKey(keyPair.secretKey);
  };

  const copyToClipboard = (string: string) => {
    navigator.clipboard.writeText(string);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    (async () => {
      hasKey ? await getBrowserSecretKey() : await generateAndSetKeys();

      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: "P-256",
        },
        true,
        ["deriveKey", "deriveBits"],
      );

      const publicKeyJwk = await window.crypto.subtle.exportKey(
        "jwk",
        keyPair.publicKey,
      );

      const privateKeyJwk = await window.crypto.subtle.exportKey(
        "jwk",
        keyPair.privateKey,
      );

      debugger;
    })();
  }, [hasKey]);

  useEffect(() => {
    setMaskedSecretKey(
      secretKey
        .split("")
        .map((x) => "*")
        .join(""),
    );
  }, [secretKey]);

  return (
    <>
      <div className="-my-18 flex min-h-screen flex-col items-center justify-center px-5">
        <div className="sm:mx-auto sm:max-w-2xl">
          <Banner
            icon={
              <EncryptionIcon className="h-16 w-16 shrink-0 text-teal-400" />
            }
            title="End to end encryption"
            message="We use a secure, end-to-end encryption setup to ensure your app secrets are protected from unauthorized access. We do not make any security/usability trade-offs. This means only you and your trusted team members will have access to decrypt app secrets. Each team members will have their own public/secret key pair."
          >
            <p className="pt-5 text-sm text-lighter">
              Please copy the following browser generated Secret Key and save it
              on your most trusted password manager. You will need this Secret
              Key when you login on a new browser or device.
            </p>

            <label
              htmlFor="secretKey"
              className="mt-5 block text-xs text-light"
            >
              Secret key
            </label>
            <TextareaGroup
              full
              rows={2}
              icon={
                <div
                  className="cursor-pointer"
                  aria-label={copied ? "Copied" : "Click to copy"}
                  data-balloon-pos="up"
                  onClick={() => {
                    copyToClipboard(secretKey);
                  }}
                >
                  {copied ? (
                    <ClipboardCheck className="h-4 w-4 text-teal-400" />
                  ) : (
                    <Clipboard className="h-4 w-4 text-lighter" />
                  )}
                </div>
              }
              name="secretKey"
              autoComplete="off"
              onMouseEnter={() => setMasked(false)}
              onMouseLeave={() => setMasked(true)}
              onChange={(e) => {
                setBrowserSecretKey(e.target.value);
              }}
              value={masked ? maskedSecretKey : secretKey}
              readOnly={!hasKey}
              className={clsx(
                "mt-2 inline-block resize-none font-mono text-lighter",
              )}
            />

            <Button
              className="float-right mt-5"
              onClick={async () => {
                const confirmText =
                  "Have you saved your secret key, you will not be able to recover your account if you lose it?";

                const result = await window.confirm(confirmText);
                if (result) {
                  router.push("/projects");
                }
              }}
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </Banner>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
  const userId = session?.user?.id as string;

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  } else {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        publicKey: true,
      },
    });

    if (!user) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    } else {
      const publicKey = (user.publicKey?.key as string) || "";

      return {
        props: {
          publicKey,
        },
      };
    }
  }
}
