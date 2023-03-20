import { useState } from "react";
import { decryptString, encryptString, generateKey } from "@47ng/cloak";
import { trpc } from "@/utils/trpc";
import { ArrowRight, Download } from "lucide-react";
import { Encryption as EncryptionIcon } from "@/components/icons";
import { Button } from "@/components/theme";
import BaseEmptyState from "@/components/theme/BaseEmptyState";
import { showToast } from "@/components/theme/showToast";
import AES from "@/lib/encryption/aes";
import OpenPGP from "@/lib/encryption/openpgp";

const EncryptionSetup = ({ ...props }) => {
  const { user, project, encryptionKeys, setEncryptionKeys } = props;
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [decryptedProjectKey, setDecryptedProjectKey] = useState("");
  const [encryptedProjectKey, setEncryptedProjectKey] = useState("");
  const [pageState, setPageState] = useState(
    encryptionKeys.personal.publicKey ? "uploadKey" : "generateKey",
  );

  const download = (filename, text) => {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text),
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const createKeys = trpc.keys.create.useMutation({
    onSuccess: (data) => {
      showToast({
        duration: 10000,
        type: "success",
        title: "Download completed",
        subtitle: `You have generated a private key for yourself, please save it in a safe place. You will need this private key next time you login, to decrypt your encrypted app secrets.`,
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

      download("envless.key", privateKey);
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
      const pgp = await OpenPGP.generageKeyPair(user.name, user.email);
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

      sessionStorage.setItem("privateKey", privateKey);

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
              <textarea
                name="privateKey"
                autoComplete="off"
                autoFocus={true}
                rows={10}
                required={true}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                    -----END PGP PRIVATE KEY BLOCK-----
                  "
                className={
                  "input-primary mb-10 w-full max-w-xl scrollbar-thin scrollbar-track-dark scrollbar-thumb-darker"
                }
              />
            )}

            <div className="justify-center">
              {pageState === "uploadKey" ? (
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading}
                >
                  Confirm and continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  disabled={loading}
                  onClick={async () => {
                    await generateEncryptionKeys();
                  }}
                >
                  <Download className="mr-2 h-5 w-5" />
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
    </>
  );
};

export default EncryptionSetup;
