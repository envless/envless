import { useState } from "react";
import { generateKey } from "@47ng/cloak";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { downloadAsTextFile } from "@/utils/helpers";
import { trpc } from "@/utils/trpc";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { useSession } from "next-auth/react";
import { Encryption as EncryptionIcon } from "@/components/icons";
import CliSetup from "@/components/integrations/CliSetup";
import { Button, SlideOver } from "@/components/theme";
import BaseEmptyState from "@/components/theme/BaseEmptyState";
import { showToast } from "@/components/theme/showToast";
import OpenPGP from "@/lib/encryption/openpgp";

const EncryptionSetup = ({ ...props }) => {
  const { user, project, encryptionKeys, setEncryptionKeys } = props;
  const [loading, setLoading] = useState(false);
  const [cliModal, setCliModal] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [decryptedProjectKey, setDecryptedProjectKey] = useState("");
  const [encryptedProjectKey, setEncryptedProjectKey] = useState(
    encryptionKeys.project.encryptedProjectKey,
  );
  const [pageState, setPageState] = useState(
    encryptionKeys.personal.publicKey ? "uploadKey" : "generateKey",
  );

  const { data: session, update } = useSession();

  useUpdateEffect(() => {
    if (pageState === "uploadKey" && !cliModal) {
      setCliModal(true);
    }
  }, [pageState]);

  const { mutate: activateCli, isLoading: loadingUpdate } =
    trpc.cli.update.useMutation({
      onSuccess: (_response) => {
        setCliModal(false);
      },

      onError: (error) => {
        console.log(error);
      },
    });

  const createKeys = trpc.keys.create.useMutation({
    onSuccess: (data) => {
      showToast({
        duration: 3000,
        type: "success",
        title: "Download completed",
        subtitle: `You have generated a private key for yourself, please continue with the next step.`,
      });

      const { projectKey, publicKey } = data;

      (async () => {
        const _decryptedProjectKey = (await OpenPGP.decrypt(
          projectKey.encryptedKey,
          privateKey,
        )) as string;

        setDecryptedProjectKey(_decryptedProjectKey);
        setEncryptedProjectKey(projectKey.encryptedKey);

        setEncryptionKeys({
          project: {
            decryptedProjectKey: _decryptedProjectKey,
            encryptedProjectKey: projectKey.encryptedKey,
          },
          personal: {
            ...encryptionKeys.personal,
            publicKey: publicKey.key,
          },
        });
      })();

      downloadAsTextFile("envless.key", privateKey);
      setCliModal(true);
      setEncryptedProjectKey(projectKey.encryptedKey);
      setPageState("uploadKey");
    },

    onError: (error) => {
      console.error(error);
      showToast({
        duration: 5000,
        type: "error",
        title: "Download failed",
        subtitle: `Something went terribly wrong, please reload the page and try again.`,
      });
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  const generateEncryptionKeys = async () => {
    const { publicKey, privateKey } = encryptionKeys.personal;

    if (!publicKey || !privateKey) {
      setLoading(true);
      const pgp = await OpenPGP.generageKeyPair(user.name || "", user.email);
      const unencryptedProjectKey = await generateKey();
      const _encryptedProjectKey = await OpenPGP.encrypt(
        unencryptedProjectKey,
        [pgp.publicKey],
      );

      await setPrivateKey(pgp.privateKey);
      await setDecryptedProjectKey(unencryptedProjectKey);

      await createKeys.mutateAsync({
        personal: { publicKey: pgp.publicKey },
        project: {
          id: project.id,
          encryptedKey: _encryptedProjectKey as string,
        },
      });
    }
  };

  const onPrivateKeySetup = async () => {
    try {
      const decryptedProjectKey = (await OpenPGP.decrypt(
        encryptedProjectKey,
        privateKey,
      )) as string;

      const updatedSession = {
        ...session,
        user: {
          ...session?.user,
          privateKey,
        },
      };

      await update(updatedSession);

      setEncryptionKeys({
        project: {
          ...encryptionKeys.project,
          decryptedProjectKey: decryptedProjectKey,
        },
        personal: {
          ...encryptionKeys.personal,
          privateKey: privateKey,
        },
      });
    } catch (error) {
      showToast({
        duration: 3000,
        type: "error",
        title: "Private key setup failed",
        subtitle: error.message,
      });
    }
  };

  return (
    <>
      <BaseEmptyState
        icon={
          <EncryptionIcon className="mx-auto mb-3 h-16 w-16 text-teal-400" />
        }
        title="Setup end to end encryption"
        subtitle={
          <>
            {pageState === "uploadKey"
              ? "Please copy/paste your previously downloaded private key."
              : "Plase create and download your Private Key. Private keys are generated on the client side and we never be saved on the database. We recommend you further encrypt and store this private key to your most trusted password manager (eg. BitWarden) on on a safe place. You will need this this key when you login on a new browser or device."}
          </>
        }
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onPrivateKeySetup();
          }}
        >
          <div className="flex flex-col items-center justify-center">
            {pageState === "uploadKey" && (
              <div className="mb-10 w-full max-w-xl">
                <textarea
                  name="privateKey"
                  autoComplete="off"
                  autoFocus={true}
                  rows={10}
                  required={true}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----"
                  className={
                    "input-primary scrollbar-thin scrollbar-track-dark scrollbar-thumb-darker w-full"
                  }
                />

                <p className="mt-2 w-full text-center text-xs">
                  ⚡ Protip: Run{" "}
                  <code className="px-1 text-red-400">
                    envless privateKey --copy
                  </code>{" "}
                  to copy from {`system's`} keychain.
                </p>
              </div>
            )}

            <div className="justify-center">
              {pageState === "uploadKey" ? (
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  rightIcon={<ArrowRight className="ml-2 h-5 w-5" />}
                >
                  Confirm and continue
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  loading={loading}
                  leftIcon={<Download className="mr-2 h-5 w-5" />}
                  onClick={async () => {
                    await generateEncryptionKeys();
                  }}
                >
                  {loading ? "Generating keys..." : "Download private key"}
                </Button>
              )}
            </div>

            <a
              href="https://envless.dev/docs/encryption"
              target={"_blank"}
              className="mt-2 text-xs text-teal-400 hover:text-teal-600"
            >
              How does end-to-end encryption work?
            </a>
          </div>
        </form>
      </BaseEmptyState>

      <SlideOver
        size="2xl"
        closable={false}
        open={cliModal}
        setOpen={setCliModal}
        title="Setup Envless CLI"
        description="Configure CLI for local development, deployment or CI/CD pipelines."
        onClose={() => {
          setCliModal(false);
        }}
        footer={
          <div className="flex flex-shrink-0 justify-start px-4 py-4">
            <Button
              className="ml-4"
              leftIcon={
                <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
              }
              onClick={async () => {
                await activateCli({ active: true });
              }}
            >
              Confirm and continue
            </Button>
          </div>
        }
      >
        <CliSetup currentProject={project} />
      </SlideOver>
    </>
  );
};

export default EncryptionSetup;
