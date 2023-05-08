import { useEffect, useState } from "react";
import { decryptString } from "@47ng/cloak";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import OpenPGP from "@/lib/encryption/openpgp";
import { PrHistory } from "../types";

function usePrHistory({
  branchId,
  branchType,
  pullRequestId,
}: {
  branchId: string;
  branchType: string;
  pullRequestId: string;
}) {
  const { data: session } = useSession();
  const [secrets, setSecrets] = useState<PrHistory[]>([]);
  const [decryptedProjectKey, setDecryptedProjectKey] = useState("");
  const sessionUser = session?.user as any;
  const privateKey = sessionUser.privateKey as string;
  const utils = trpc.useContext();

  useEffect(() => {
    const envSecrets: PrHistory[] = [];
    if (!privateKey) return;

    (async () => {
      const { branch, pullRequestHistories } =
        await utils.pullRequestHistory.getAllPrHistoryByBranchId.fetch({
          branchId,
          pullRequestId,
          branchType,
        });

      const _encryptedProjectKey =
        branch?.project.encryptedProjectKey?.encryptedKey;

      const _decryptedProjectKey = (await OpenPGP.decrypt(
        _encryptedProjectKey as string,
        privateKey as string,
      )) as string;

      setDecryptedProjectKey(_decryptedProjectKey as string);

      for (const secret of pullRequestHistories) {
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
        });
      }

      setSecrets(envSecrets);
    })();
  }, [branchId, privateKey]);

  return {
    secrets,
    setSecrets,
    decryptedProjectKey,
  };
}

export default usePrHistory;
