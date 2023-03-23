import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

interface EnvDiffViewerProps {
  oldCode: string;
  newCode: string;
  leftTitle: string;
  rightTitle: string;
}

export default function EnvDiffViewer({
  oldCode,
  newCode,
  leftTitle,
  rightTitle,
}: EnvDiffViewerProps) {
  return (
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
      leftTitle={leftTitle}
      rightTitle={rightTitle}
      hideLineNumbers
      compareMethod={DiffMethod.WORDS}
      oldValue={oldCode}
      newValue={newCode}
      splitView={true}
      useDarkTheme
    />
  );
}
