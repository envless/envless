import { useEffect, useState } from "react";
import { decryptString } from "@47ng/cloak";
import { trpc } from "@/utils/trpc";
import { repeat } from "lodash";
import { useSession } from "next-auth/react";
import OpenPGP from "@/lib/encryption/openpgp";
import { EnvSecret } from "../types";

function useVersionedSecret({
  branchId,
  pullRequestId,
  forCurrentBranch,
}: {
  branchId: string;
  pullRequestId: string;
  forCurrentBranch: boolean;
}) {
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
        await utils.pullRequest.getVersionedSecrets.fetch({
          branchId,
          forCurrentBranch,
          pullRequestId,
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
          encryptedKey: secret.encryptedKey,
          encryptedValue: secret.encryptedValue,
          decryptedKey,
          decryptedValue,
          hiddenValue: repeat("*", decryptedValue.length),
          hidden: true,
        });
      }

      setSecrets(envSecrets);
    })();
  }, [branchId, privateKey, forCurrentBranch, pullRequestId]);

  return {
    secrets,
    setSecrets,
    decryptedProjectKey,
  };
}

export default useVersionedSecret;
