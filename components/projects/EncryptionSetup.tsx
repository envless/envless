import { useState } from "react";
import { decryptString, encryptString, generateKey } from "@47ng/cloak";
import { trpc } from "@/utils/trpc";
import { Download } from "lucide-react";
import { Encryption as EncryptionIcon } from "@/components/icons";
import { Button, Modal } from "@/components/theme";
import BaseEmptyState from "@/components/theme/BaseEmptyState";
import { showToast } from "@/components/theme/showToast";
import AES from "@/lib/encryption/aes";
import OpenPGP from "@/lib/encryption/openpgp";

const EncryptionSetup = ({ ...props }) => {
  const { user, project, encryptionKeys, setEncryptionKeys } = props;
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [decryptedProjectKey, setDecryptedProjectKey] = useState("");

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

      // TODO - this is not logging decrypteProjectKey and privateKey
      // console.log(
      //   "🚀 ~ file: EncryptionSetup.tsx ~ line 67 ~ createKeys ~ projectKey",
      //   `Decrypted project key: ${decryptedProjectKey}`,
      //   `Encrypted project key: ${projectKey.encryptedKey}`,
      //   `Personal publicKey ${publicKey.key}`,
      //   `Personal privateKey ${privateKey}`,
      // )

      async () => {
        const _decryptedProjectKey = (await OpenPGP.decrypt(
          projectKey.encryptedKey,
          privateKey,
        )) as string;

        setDecryptedProjectKey(_decryptedProjectKey);

        setEncryptionKeys({
          project: {
            decryptedProjectKey: _decryptedProjectKey,
            encryptedProjectKey: projectKey.encryptedKey,
          },
          personal: {
            publicKey: publicKey.key,
            privateKey: privateKey,
          },
        });
      };

      download("envless.key", privateKey);
    },

    onError: (error) => {
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
      const encryptedProjectKey = await OpenPGP.encrypt(unencryptedProjectKey, [
        pgp.publicKey,
      ]);

      await setPrivateKey(pgp.privateKey);
      await setDecryptedProjectKey(unencryptedProjectKey);

      await createKeys.mutateAsync({
        personal: { publicKey: pgp.publicKey },
        project: {
          id: project.id,
          encryptedKey: encryptedProjectKey as string,
        },
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
            Plase create and download your Private Key. Private keys are
            generated on the client side and we never be saved on the database.
            We recommend you further encrypt and store this private key to your
            most trusted password manager (eg. BitWarden) on on a safe place.
            You will need this this key when you login on a new browser or
            device.
          </>
        }
      >
        <div className="flex flex-col items-center justify-center">
          <div className="justify-center">
            <Button
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
          </div>

          <a
            href="https://envless.dev/docs/encryption"
            target={"_blank"}
            className="mt-2 text-xs text-teal-400 hover:text-teal-600"
          >
            How does end-to-end encryption work?
          </a>
        </div>
      </BaseEmptyState>

      <Modal button={<>Button</>} title="Create a new project">
        Modal contents
      </Modal>
    </>
  );
};

export default EncryptionSetup;
