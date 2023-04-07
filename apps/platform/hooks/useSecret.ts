import { useState } from "react";
import { decryptString } from "@47ng/cloak";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { trpc } from "@/utils/trpc";
import { repeat } from "lodash";
import { EnvSecret } from "@/components/projects/EnvironmentVariableEditor";
import OpenPGP from "@/lib/encryption/openpgp";

function useSecret({ branchId }: { branchId: string }) {
  const [decryptedProjectKey, setDecryptedProjectKey] = useState("");
  const [encryptedProjectKey, setEncryptedProjectKey] = useState("");
  const privateKey = sessionStorage.getItem("privateKey");

  const secretsQuery = trpc.secrets.getSecretesByBranchId.useQuery(
    { branchId },
    { refetchOnWindowFocus: false, refetchOnMount: false },
  );

  const envSecrets: EnvSecret[] = [];
  let hasDecryptionCompleted = false;

  if (!secretsQuery.isLoading && secretsQuery.data) {
    const { branch, secrets } = secretsQuery.data;

    const _encryptedProjectKey =
      branch?.project.encryptedProjectKey?.encryptedKey;

    (async () => {
      const _decryptedProjectKey = (await OpenPGP.decrypt(
        _encryptedProjectKey as string,
        privateKey as string,
      )) as string;

      setDecryptedProjectKey(_decryptedProjectKey);
      setEncryptedProjectKey(_encryptedProjectKey as string);

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
          maskedValue: repeat("*", decryptedValue.length),
        });
      }

      console.log({ envSecrets });
    })();
  }

  return {
    secrets: secretsQuery.data,
    isSecretsLoading: secretsQuery.isLoading && hasDecryptionCompleted,
  };
}

export default useSecret;
