import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { downloadAsTextFile } from "@/utils/helpers";
import { trpc } from "@/utils/trpc";
import type { Keychain, User } from "@prisma/client";
import * as argon2 from "argon2-browser";
import { delay } from "lodash";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import * as openpgp from "openpgp";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { Encryption as EncryptionIcon } from "@/components/icons";
import { Button, Hr, Input } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
import { decrypt, encrypt, generageKeyPair } from "@/lib/encryption/openpgp";

const ALLOWED_RETRIES = 7;

type PageProps = {
  setPage: any;
  user: User;
  page: string;
  keychain: Keychain;
  csrfToken: string;
};

type KeychainParams = {
  privateKey?: string;
};

const EncryptionSetup = ({
  user,
  setPage,
  csrfToken,
  page,
  keychain,
}: PageProps) => {
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
  const [publicKey, setPublicKey] = useState(keychain?.publicKey);
  const [verificationString, setVerificationString] = useState(
    keychain?.verificationString,
  );

  const { mutateAsync: createKeychainMutation, isLoading } =
    trpc.auth.keychain.useMutation({
      onSuccess: async (_response) => {
        const newSession = {
          ...session,
          user: {
            ...session?.user,
            privateKey,
          },
        };

        await updateSessionWith(newSession);
        downloadAsTextFile(
          `envless-privateKey-for-user-${user.id}.txt`,
          privateKey,
        );

        showToast({
          duration: 10000,
          type: "success",
          title: "Succefully created keychain",
          subtitle:
            "You have successfully created and downloaded your PGP encryption private key. You will need this key to login and decrypt your secrets.",
        });

        setLoading(false);
        await setPage("verifyKeychain");
      },

      onError: (error) => {
        showToast({
          duration: 10000,
          type: "error",
          title: "Houston, we have a problem!",
          subtitle: error.message,
        });
      },
    });

  const createKeychain = async (data: KeychainParams) => {
    setLoading(true);

    const keypair = await generageKeyPair(user.name as string, user.email);

    const verificationString = (await encrypt(user.id, [
      keypair.publicKey,
    ])) as string;

    setPublicKey(keypair.publicKey);
    setPrivateKey(keypair.privateKey);
    setVerificationString(verificationString);
    await createKeychainMutation({
      publicKey: keypair.publicKey,
      verificationString: verificationString,
      revocationCertificate: keypair.revocationCertificate,
    });
  };

  const onSubmit = async (data: KeychainParams) => {
    try {
      const decryptedVerificationString = await decrypt(
        verificationString,
        privateKey,
      );

      if (decryptedVerificationString === user.id) {
        const newSession = {
          ...session,
          user: {
            ...session?.user,
            isPrivateKeyValid: true,
            privateKey,
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
      showToast({
        duration: 3000,
        type: "error",
        title: "Invalid private key",
        subtitle: "Please enter a valid private key",
      });
    }
  };

  const verifyOneTimePassword = async (data: { password: string }) => {
    const { password } = data;

    try {
      await argon2.verify({
        pass: password,
        encoded: user.hashedPassword as string,
        type: argon2.ArgonType.Argon2id,
      });

      const tempEncryptedPrivateKey = session?.user
        .tempEncryptedPrivateKey as any;

      const privateKeyMessage = await openpgp.readMessage({
        armoredMessage: tempEncryptedPrivateKey,
      });

      const { data: decrypted } = await openpgp.decrypt({
        message: privateKeyMessage,
        passwords: [password],
      });

      debugger;

      // TODO
    } catch (error) {
      debugger;
      let message;

      if (retries >= ALLOWED_RETRIES) {
        message =
          "You have exceeded the maximum number of allowed retries. Please ask your admin to send you a new invite.";
        delay(() => {
          // signOut();
        }, 4000);
      } else if (retries >= 2) {
        message = `You have ${
          ALLOWED_RETRIES - retries
        } attempts left. Please double check your password and try again.`;
      } else {
        message = "Please double check your password and try again.";
      }

      showToast({
        duration: 5000,
        type: "error",
        title: "Password does not match!",
        subtitle: message,
      });

      setRetries(retries + 1);
    }
  };

  return (
    <>
      <div className="flex flex-col px-5 py-32">
        <div className="bg-darker rounded-md px-10 py-12 sm:mx-auto sm:w-full sm:max-w-xl">
          <EncryptionIcon className="mx-auto mb-3 h-16 w-16 text-teal-400" />
          {page === "verifyOneTimePassword" ? (
            <>
              <h2 className="mt-6 text-center text-2xl">
                Verify your one time password
              </h2>

              <p className="max-w mt-2 text-center text-sm text-gray-600">
                Please enter the one time password sent to your email address.
              </p>
            </>
          ) : (
            <h2 className="mt-6 text-center text-2xl">
              End to end encryption setup
            </h2>
          )}

          <Hr className="my-5" />

          {page === "verifyOneTimePassword" && (
            <div className="mx-auto max-w-sm">
              <form onSubmit={handleSubmit(verifyOneTimePassword)}>
                <Input
                  type="password"
                  name="password"
                  label="One time password"
                  required
                  full
                  register={register}
                  errors={errors}
                  autoComplete="off"
                />

                <Button type="submit" className="w-full">
                  Verify one time password
                </Button>
              </form>
            </div>
          )}

          {page === "createKeychain" && (
            <>
              <div className="rounded-md bg-teal-400/10 px-4 py-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-teal-400" />
                  </div>

                  <div className="ml-3">
                    <div className="text-sm text-teal-400">
                      <p className="font-mono">
                        Please download your PGP private key. We recommend you
                        further encrypt and store this private key to your most
                        trusted password manager(eg. BitWarden), your computer's
                        keychain or on a safe place. Secrets cannot be decrypted
                        without this key and you will need this key everytime
                        you login.
                      </p>

                      <p className="mt-5 font-mono">
                        <strong>Note:</strong> You will not see this screen
                        again, so please make sure you download your private
                        key. If you lose your private key, you will not be able
                        to decrypt your secrets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  sr={"Download your PGP private key"}
                  type="submit"
                  width="full"
                  disabled={loading}
                  onClick={async () => {
                    await createKeychain({ privateKey });
                  }}
                  loading={loading}
                  rightIcon={
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  }
                >
                  Download your PGP private key
                </Button>
              </div>
            </>
          )}

          {page === "verifyKeychain" && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-8">
                <div className="text-light mb-2 text-sm">
                  Paste your PGP private key
                  {session?.user?.privateKey && (
                    <span
                      onClick={() =>
                        downloadAsTextFile(
                          "envless.txt",
                          session?.user?.privateKey,
                        )
                      }
                      className="ml-2 cursor-pointer text-xs text-teal-400 hover:text-teal-600"
                    >
                      download private key
                    </span>
                  )}
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
          )}

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
    </>
  );
};

export default EncryptionSetup;
