import { useState } from "react";
import useSecret from "@/hooks/useSecret";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { Branch } from "@prisma/client";
import { Loader } from "lucide-react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import BaseEmptyState from "@/components/theme/BaseEmptyState";

interface EnvDiffViewerProps {
  baseBranch: Branch;
  currentBranch: Branch;
}

const LoadingComponent = () => (
  <BaseEmptyState
    icon={<Loader className="mx-auto mb-3 h-8 w-8 animate-spin" />}
    title="Loading diff..."
    subtitle="Plesae wait while we decrypt and load the diff."
  />
);

export default function EnvDiffViewer({
  baseBranch,
  currentBranch,
}: EnvDiffViewerProps) {
  const [loading, setLoading] = useState(true);
  const [baseEnv, setBaseEnv] = useState<string>();
  const [currentEnv, setCurrentEnv] = useState<string>();
  const { secrets: currentSecrets } = useSecret({ branchId: currentBranch.id });
  const { secrets: baseSecrets } = useSecret({ branchId: baseBranch.id });
  // setCurrentEnv(JSON.stringify(currentSecrets));
  // setBaseEnv(JSON.stringify(baseSecrets));

  useUpdateEffect(() => {
    for (const [key, secret] of Object.entries(currentSecrets)) {
      const { decryptedKey, decryptedValue } = secret;

      setCurrentEnv((prev) => {
        if (!prev) {
          return `${decryptedKey}=${decryptedValue}`;
        }
        return `${prev}\n${decryptedKey}=${decryptedValue}`;
      });
    }

    for (const [key, secret] of Object.entries(baseSecrets)) {
      const { decryptedKey, decryptedValue } = secret;

      setBaseEnv((prev) => {
        if (!prev) {
          return `${decryptedKey}=${decryptedValue}`;
        }

        return `${prev}\n${decryptedKey}=${decryptedValue}`;
      });
    }

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
          oldValue={baseEnv}
          newValue={currentEnv}
          splitView={true}
          useDarkTheme={true}
        />
      )}
    </>
  );
}
