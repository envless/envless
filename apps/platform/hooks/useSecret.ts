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
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState("");

  useUpdateEffect(() => {
    const privateKey = sessionStorage.getItem("privateKey");

    (async () => {
      const decryptedProjectKey = (await OpenPGP.decrypt(
        decryptedPrivateKey,
        privateKey as string,
      )) as string;

      setDecryptedPrivateKey(decryptedProjectKey);
    })();
  }, [decryptedPrivateKey]);

  const secretsQuery = trpc.secrets.getSecretesByBranchId.useQuery(
    { branchId },
    {
      refetchOnWindowFocus: false,
    },
  );

  const envSecrets: EnvSecret[] = [];
  let hasDecryptionCompleted = false;

  if (!secretsQuery.isLoading && secretsQuery.data) {
    secretsQuery.data.forEach(async (secret) => {
      console.log("secret", decryptedPrivateKey);

      const decryptedKey = await decryptString(
        secret.encryptedKey,
        decryptedPrivateKey,
      );
      const decryptedValue = await decryptString(
        secret.encryptedValue,
        decryptedPrivateKey,
      );

      envSecrets.push({
        encryptedKey: secret.encryptedKey,
        encryptedValue: secret.encryptedValue,
        decryptedKey,
        decryptedValue,
        maskedValue: repeat("*", decryptedValue.length),
      });

      if (secretsQuery.data.length === envSecrets.length) {
        hasDecryptionCompleted = true;
      }
    });
  }

  return {
    secrets: secretsQuery.data,
    isSecretsLoading: secretsQuery.isLoading && hasDecryptionCompleted,
  };
}

export default useSecret;
