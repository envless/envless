import { useState } from "react";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import useVersionedSecret from "@/hooks/useVersionedSecret";
import { Branch } from "@prisma/client";
import { union } from "lodash";
import { Loader } from "lucide-react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import BaseEmptyState from "@/components/theme/BaseEmptyState";

interface EnvDiffViewerProps {
  baseBranch: Branch;
  currentBranch: Branch;
  pullRequestId: string;
}

const LoadingComponent = () => (
  <BaseEmptyState
    icon={<Loader className="mx-auto mb-3 h-8 w-8 animate-spin" />}
    title="Loading diff..."
    subtitle="Please wait while we decrypt and load the diff."
  />
);

export default function EnvDiffViewer({
  baseBranch,
  currentBranch,
  pullRequestId,
}: EnvDiffViewerProps) {
  const [loading, setLoading] = useState(true);
  const [baseEnv, setBaseEnv] = useState<string[]>([]);
  const [currentEnv, setCurrentEnv] = useState<string[]>([]);
  const { secrets: currentSecrets } = useVersionedSecret({
    branchId: currentBranch.id,
    forCurrentBranch: true,
    pullRequestId: pullRequestId,
  });
  const { secrets: baseSecrets } = useVersionedSecret({
    branchId: baseBranch.id,
    forCurrentBranch: false,
    pullRequestId: pullRequestId,
  });

  useUpdateEffect(() => {
    let baseSecretArray = [] as string[];
    let currentSecretArray = [] as string[];

    for (const [_key, secret] of Object.entries(currentSecrets)) {
      const { decryptedKey, decryptedValue } = secret;

      currentSecretArray = union(currentSecretArray, [
        `${decryptedKey}=${decryptedValue}`,
      ]);
    }

    setCurrentEnv(currentSecretArray);

    for (const [_key, secret] of Object.entries(baseSecrets)) {
      const { decryptedKey, decryptedValue } = secret;
      baseSecretArray = union(baseSecretArray, [
        `${decryptedKey}=${decryptedValue}`,
      ]);
    }

    setBaseEnv(baseSecretArray);

    setLoading(false);
  }, [baseSecrets, currentSecrets]);

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <ReactDiffViewer
          styles={{
            variables: {
              dark: {
                diffViewerBackground: "#2e303c",
                diffViewerColor: "#FFF",
                addedBackground: "#044B53",
                addedColor: "white",
                removedBackground: "#632F34",
                removedColor: "white",
                wordAddedBackground: "#055d67",
                wordRemovedBackground: "#7d383f",
                addedGutterBackground: "#034148",
                removedGutterBackground: "#632b30",
                gutterBackground: "#2c2f3a",
                gutterBackgroundDark: "#262933",
                highlightBackground: "#2a3967",
                highlightGutterBackground: "#2d4077",
                codeFoldGutterBackground: "#21232b",
                codeFoldBackground: "#262831",
                emptyLineBackground: "#363946",
                gutterColor: "#464c67",
                addedGutterColor: "#8c8c8c",
                removedGutterColor: "#8c8c8c",
                codeFoldContentColor: "#555a7b",
                diffViewerTitleBackground: "#2f323e",
                diffViewerTitleColor: "#fff",
                diffViewerTitleBorderColor: "#353846",
              },
            },
          }}
          leftTitle={baseBranch.name}
          rightTitle={currentBranch.name}
          hideLineNumbers
          linesOffset={2}
          compareMethod={DiffMethod.WORDS}
          oldValue={baseEnv.sort().join("\n")}
          newValue={currentEnv.sort().join("\n")}
          splitView={true}
          useDarkTheme={true}
        />
      )}
    </>
  );
}
