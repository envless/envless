import { useState } from "react";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;
type CopyState = boolean;

function useCopyToClipBoard(): [CopyFn, CopiedValue, CopyState] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);
  const [copied, setCopied] = useState<CopyState>(false);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 300);

      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      setCopied(false);
      return false;
    }
  };

  return [copy, copiedText, copied];
}

export default useCopyToClipBoard;
