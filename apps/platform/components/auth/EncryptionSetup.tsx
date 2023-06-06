import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { UserType } from "@/types/resources";
import { downloadAsTextFile } from "@/utils/helpers";
import { trpc } from "@/utils/trpc";
import type { Keychain } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { Encryption as EncryptionIcon } from "@/components/icons";
import { Button, Hr, Input } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
import OpenPGP from "@/lib/encryption/openpgp";

type PageProps = {
  setPage: any;
  user: UserType;
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
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState(keychain?.publicKey);
  const [verificationString, setVerificationString] = useState(
    keychain?.verificationString,
  );
  const [str, setStr] = useState("hello");

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
        downloadAsTextFile("envless.txt", privateKey);

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

    const keypair = await OpenPGP.generageKeyPair(
      user.name as string,
      user.email,
    );

    const verificationString = (await OpenPGP.encrypt(user.id, [
      keypair.publicKey,
    ])) as string;

    setPublicKey(keypair.publicKey);
    setPrivateKey(keypair.privateKey);
    setVerificationString(verificationString);
    await createKeychainMutation({
      publicKey: keypair.publicKey,
      verificationString: verificationString,
      revocationCertificate: keypair.privateKey,
    });
  };

  const onSubmit = async (data: KeychainParams) => {
    try {
      const decryptedVerificationString = await OpenPGP.decrypt(
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

  return (
    <>
      <div className="flex flex-col px-5 py-32">
        <div className="bg-darker rounded-md px-10 py-12 sm:mx-auto sm:w-full sm:max-w-lg">
          <EncryptionIcon className="mx-auto mb-3 h-16 w-16 text-teal-400" />
          <h2 className="mt-6 text-center text-2xl">
            End to end encryption keys
          </h2>

          <Hr className="my-5" />

          {page === "createKeychain" ? (
            <>
              <p className="text-light mt-2 text-center text-sm">
                Generate and download your encryption keys. Encryption keys are
                generated on the client side and never saved on our database,
                encrypted or otherwise. We recommend you further encrypt and
                store this private key to your most trusted password manager(eg.
                BitWarden) or on a safe place. Secrets cannot be decrypted
                without this key and you will need this this key everytime you
                login.
              </p>

              <div className="mt-8">
                <Button
                  sr={"Generate and download encryption keys"}
                  type="submit"
                  width="full"
                  disabled={loading}
                  onClick={async () => {
                    await createKeychain({ privateKey });
                  }}
                  loading={loading}
                >
                  Generate and download encryption keys
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-8">
                <div className="text-light mb-2 text-sm">
                  Your PGP encryption private key
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
                  rows={10}
                  required={true}
                  placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----"
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className={
                    "input-primary scrollbar-thin scrollbar-track-dark scrollbar-thumb-darker w-full"
                  }
                />

                <Button
                  sr={"Generate and download encryption keys"}
                  type="submit"
                  width="full"
                  disabled={loading}
                  className="mt-8"
                  loading={loading}
                  rightIcon={
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  }
                >
                  Verify private key and continue
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
