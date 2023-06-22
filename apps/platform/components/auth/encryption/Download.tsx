import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { downloadAsTextFile } from "@/utils/helpers";
import { trpc } from "@/utils/trpc";
import type { Keychain, User } from "@prisma/client";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Encryption as EncryptionIcon } from "@/components/icons";
import { Container } from "@/components/theme";
import { Button, Hr } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
import { encrypt, generageKeyPair } from "@/lib/encryption/openpgp";

type PageProps = {
  currentUser: User;
  keychain: Keychain;
};

type KeychainParams = {
  privateKey?: string;
};

const DownloadPrivateKey = ({ currentUser, keychain }: PageProps) => {
  const router = useRouter();
  const { data: session, update: updateSessionWith } = useSession();
  const [loading, setLoading] = useState(false);
  const [retries, setRetries] = useState(0);
  const [privateKey, setPrivateKey] = useState("");

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
          `envless-privateKey-for-user-${currentUser.id}.txt`,
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
        router.push("/auth/encryption/verify");
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

    const keypair = await generageKeyPair(
      currentUser.name as string,
      currentUser.email,
    );

    const verificationString = (await encrypt(currentUser.id, [
      keypair.publicKey,
    ])) as string;

    setPrivateKey(keypair.privateKey);

    await createKeychainMutation({
      publicKey: keypair.publicKey,
      verificationString: verificationString,
      revocationCertificate: keypair.revocationCertificate,
    });
  };

  return (
    <Container>
      <div className="mt-16">
        <div className="flex flex-col px-5 py-32">
          <div className="bg-darker rounded-md px-10 py-12 sm:mx-auto sm:w-full sm:max-w-xl">
            <EncryptionIcon className="mx-auto mb-3 h-16 w-16 text-teal-400" />

            <h2 className="mt-6 text-center text-2xl">
              Download your PGP private key
            </h2>

            <Hr className="my-5" />

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
                      without this key and you will need this key everytime you
                      login.
                    </p>

                    <p className="mt-5 font-mono">
                      <strong>Note:</strong> You may not see this screen again,
                      so please make sure you download your private key. If you
                      lose your private key, we will not be able to restore your
                      account.
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

export default DownloadPrivateKey;
