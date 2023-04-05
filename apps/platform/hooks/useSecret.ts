import { useState } from "react";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { trpc } from "@/utils/trpc";
import { EnvSecret } from "@/components/projects/EnvironmentVariableEditor";
import OpenPGP from "@/lib/encryption/openpgp";

function useSecret({
  branchId,
  publicKey,
}: {
  branchId: string;
  publicKey: string;
}) {
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState("");

  useUpdateEffect(() => {
    const privateKey = sessionStorage.getItem("privateKey");

    /*
        const decryptedProjectKey = (await OpenPGP.decrypt(
          encryptedProjectKey as never,
          privateKey,
        )) as string;
                */
  }, [publicKey]);

  const secretsQuery = trpc.secrets.getSecretesByBranchId.useQuery(
    { branchId },
    {
      refetchOnWindowFocus: false,
    },
  );

  const envSecrets: EnvSecret[] = [];
  const hasDescryptionCompleted = false;

  if (!secretsQuery.isLoading && secretsQuery.data) {
    secretsQuery.data.forEach((secret) => {});
  }

  return {
    secrets: secretsQuery.data,
    isSecretsLoading: secretsQuery.isLoading,
  };
}

export default useSecret;
