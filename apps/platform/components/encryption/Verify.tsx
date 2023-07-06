import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { downloadAsTextFile } from "@/utils/helpers";
import type { Keychain, User } from "@prisma/client";
import { delay } from "lodash";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { Encryption as EncryptionIcon } from "@/components/icons";
import { Container } from "@/components/theme";
import { Button, Hr, Input } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
import { decrypt, encrypt, generageKeyPair } from "@/lib/encryption/openpgp";

const ALLOWED_RETRIES = 10;

type PageProps = {
  currentUser: User;
  keychain: Keychain;
};

type KeychainParams = {
  privateKey?: string;
};

const VerifyEncryption = ({ currentUser, keychain }: PageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const { data: session, update: updateSessionWith } = useSession();
  const [loading, setLoading] = useState(false);
  const [retries, setRetries] = useState(0);
  const [privateKey, setPrivateKey] = useState("");
  const [verificationString, setVerificationString] = useState(
    keychain?.verificationString,
  );

  const onSubmit = async (data: KeychainParams) => {
    setLoading(true);

    try {
      const decryptedVerificationString = await decrypt(
        verificationString,
        privateKey,
      );

      if (decryptedVerificationString === currentUser.id) {
        const newSession = {
          ...session,
          user: {
            ...session?.user,
            keychain: {
              ...session?.user.keychain,
              valid: true,
              privateKey,
            },
          },
        };

        await updateSessionWith(newSession);
        await router.push("/projects");
      } else {
        showToast({
          duration: 3000,
          type: "error",
          title: "Invalid private key",
          subtitle: "Please enter a valid private key",
        });
      }
    } catch (error) {
      let message;

      if (retries >= ALLOWED_RETRIES) {
        message =
          "You have exceeded the maximum number of allowed retries. Please double check your private key and login again.";
        delay(() => {
          signOut();
        }, 4000);
      } else if (retries >= 5) {
        message = `You have ${
          ALLOWED_RETRIES - retries
        } attempts left. Please double check your private key and try again.`;
      } else {
        message = "Please double check your private key and try again.";
      }

      showToast({
        duration: 3000,
        type: "error",
        title: "Invalid private key",
        subtitle: message,
      });

      setRetries(retries + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="mt-16">
        <div className="flex flex-col px-5 py-32">
          <div className="bg-darker rounded-md px-10 py-12 sm:mx-auto sm:w-full sm:max-w-xl">
            <EncryptionIcon className="mx-auto mb-3 h-16 w-16 text-teal-400" />

            <h2 className="mt-6 text-center text-2xl">Your PGP private key</h2>

            <p className="max-w text-light mt-2 text-center text-sm">
              Please copy/paste your previously downloaded/shared PGP private
              key. We never store your PGP private key, encrypted or otherwise.
              This private key is needed to encrypt and decrypt your app secrets
              on the client side.
            </p>

            <Hr className="my-5" />

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-8">
                <div className="text-light mb-2 text-sm">
                  Your PGP private key
                </div>
                <textarea
                  {...register("privateKey")}
                  autoComplete="off"
                  autoFocus={true}
                  rows={15}
                  required={true}
                  placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----"
                  onChange={(e) => setPrivateKey(e.target.value)}
                  spellCheck={false}
                  className={
                    "scrollbar-thin scrollbar-track-dark scrollbar-thumb-darker w-full rounded border-teal-400/30 bg-teal-400/10 font-mono text-xs text-teal-400"
                  }
                />

                <Button
                  sr={"Generate and download PGP private key"}
                  type="submit"
                  width="full"
                  disabled={loading}
                  className="mt-8"
                  loading={loading}
                  rightIcon={
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  }
                >
                  Verify your private key and continue
                </Button>
              </div>
            </form>

            <div className="mt-3 text-center">
              <Link
                href="https://envless.dev/docs/encryption"
                target="_blank"
                className="text-xs text-teal-400 hover:text-teal-600"
              >
                How does end-to-end encryption work?
              </Link>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </Container>
  );
};

export default VerifyEncryption;
