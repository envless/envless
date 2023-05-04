import { useEffect, useState } from "react";
import { decryptString } from "@47ng/cloak";
import { trpc } from "@/utils/trpc";
import { repeat } from "lodash";
import { useSession } from "next-auth/react";
import OpenPGP from "@/lib/encryption/openpgp";
import { EnvSecret } from "../types";

function useSecret({ branchId }: { branchId: string }) {
  // const [isSecretsLoading, setIsSecretsLoading] = useState(true);
  const { data: session } = useSession();
  const [secrets, setSecrets] = useState<EnvSecret[]>([]);
  const [decryptedProjectKey, setDecryptedProjectKey] = useState("");
  const sessionUser = session?.user as any;
  const privateKey = sessionUser.privateKey as string;
  const utils = trpc.useContext();

  useEffect(() => {
    const envSecrets: EnvSecret[] = [];
    if (!privateKey) return;

    (async () => {
      const { branch, secrets } =
        await utils.secrets.getSecretesByBranchId.fetch({
          branchId,
        });

      const _encryptedProjectKey =
        branch?.project.encryptedProjectKey?.encryptedKey;

      const _decryptedProjectKey = (await OpenPGP.decrypt(
        _encryptedProjectKey as string,
        privateKey as string,
      )) as string;

      setDecryptedProjectKey(_decryptedProjectKey as string);

      for (const secret of secrets) {
        const { encryptedKey, encryptedValue } = secret;

        const decryptedKey = await decryptString(
          encryptedKey as string,
          _decryptedProjectKey as string,
        );

        const decryptedValue = await decryptString(
          encryptedValue as string,
          _decryptedProjectKey as string,
        );

        envSecrets.push({
          id: secret.id,
          uuid: secret.uuid,
          encryptedKey: secret.encryptedKey,
          encryptedValue: secret.encryptedValue,
          decryptedKey,
          decryptedValue,
          hiddenValue: repeat("*", decryptedValue.length),
          hidden: true,
        });
      }

      // setIsSecretsLoading(false);
      setSecrets(envSecrets);
    })();
  }, [branchId, privateKey]);

  return {
    secrets,
    //isSecretsLoading: isSecretsLoading,
    setSecrets,
    decryptedProjectKey,
  };
}

export default useSecret;
