import { useState } from "react";
import { decryptString } from "@47ng/cloak";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { trpc } from "@/utils/trpc";
import { repeat } from "lodash";
import { EnvSecret } from "@/components/projects/EnvironmentVariableEditor";
import OpenPGP from "@/lib/encryption/openpgp";

function useSecret({
  branchId,
}: //encryptedProjectKey
{
  branchId: string;
  // publicKey: string;
  // encryptedProjectKey: string;
}) {
  const [decryptedProjectKey, setDecryptedProjectKey] = useState("");
  const [encryptedProjectKey, setEncryptedProjectKey] = useState("");

  // useUpdateEffect(() => {
  const privateKey = sessionStorage.getItem("privateKey");

  // }, [encryptedProjectKey]);

  const secretsQuery = trpc.secrets.getSecretesByBranchId.useQuery(
    { branchId },
    {
      refetchOnWindowFocus: false,
    },
  );

  const envSecrets: EnvSecret[] = [];
  let hasDecryptionCompleted = false;

  if (!secretsQuery.isLoading && secretsQuery.data) {
    const _encryptedProjectKey =
      secretsQuery.data.branches[0].project.encryptedProjectKey?.encryptedKey;

    (async () => {
      const decryptedProjectKey = (await OpenPGP.decrypt(
        _encryptedProjectKey as string,
        privateKey as string,
      )) as string;

      console.log({
        decryptedProjectKey,
      });

      setDecryptedProjectKey(decryptedProjectKey);
      setEncryptedProjectKey(_encryptedProjectKey as string);
    })();

    secretsQuery.data.secrets.forEach(async (secret) => {
      const decryptedKey = await decryptString(
        secret.encryptedKey as string,
        decryptedProjectKey as string,
      );
      const decryptedValue = await decryptString(
        secret.encryptedValue as string,
        decryptedProjectKey as string,
      );

      envSecrets.push({
        encryptedKey: secret.encryptedKey,
        encryptedValue: secret.encryptedValue,
        decryptedKey,
        decryptedValue,
        maskedValue: repeat("*", decryptedValue.length),
      });

      // if (secretsQuery.data.length === envSecrets.length) {
      //   hasDecryptionCompleted = true;
      // }
    });
  }

  return {
    secrets: secretsQuery.data,
    isSecretsLoading: secretsQuery.isLoading && hasDecryptionCompleted,
  };
}

export default useSecret;
