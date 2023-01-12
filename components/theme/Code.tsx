import { useState } from "react";
import { FiCheckCircle, FiCopy } from "react-icons/fi";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

/**
 * Props for the Code component
 * @typedef {Object} Props
 * @property {string} code - The code to be displayed
 * @property {string} language - The language of the code
 */
type Props = {
  code: string;
  language: string;
};

/**
 * Code component to display and copy code with syntax highlighting
 * @param {Props} props - The props for the component
 */
const Code: React.FC<Props> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  /**
   * Copies the given code to the clipboard
   * @param {string} code - The code to be copied
   */
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
