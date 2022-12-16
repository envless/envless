import { useState } from "react";
import { FiCopy, FiCheckCircle } from "react-icons/fi";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism";

type Props = {
  code: string;
  language: string;
};

const Code: React.FC<Props> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          className="absolute mt-5 mr-3 flex items-center justify-center"
          onClick={() => {
            copyToClipboard(code);
          }}
        >
          {copied ? (
            <FiCheckCircle className="h-5 w-5 text-teal-400" />
          ) : (
            <FiCopy className="h-5 w-5 text-gray-300" />
          )}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={dracula}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default Code;
