import { Dispatch, SetStateAction } from "react";
import { EnvSecret } from "@/types/index";

export const parseEnvFile = async (
  file: File,
  setEnvKeys: Dispatch<SetStateAction<EnvSecret[]>>,
) => {
  /*
  const reader = new FileReader();

  const readFile = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  });

  reader.readAsText(file, "UTF-8");
  const contents = (await readFile) as string;
  */

  const fileContents = await readFileContents(file);

  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

  switch (fileExtension) {
    case "env":
      break;

    case "json":
      break;
  }

  // now parse based on the file type

  const pairs = await parseEnvContent(fileContents);
  setEnvKeys([...pairs]);
};

async function readFileContents(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (event: ProgressEvent<FileReader>) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = (error: ProgressEvent<FileReader>) => {
      reject(error);
    };
    reader.readAsText(file);
  });
}

export const parseEnvContent = async (contents: string) => {
  const pairs = parse(contents);
  const secrets: EnvSecret[] = [];

  Object.keys(pairs).forEach((key) => {
    const value = pairs[key];
    const secret = {
      encryptedKey: key,
      encryptedValue: value,
      decryptedKey: key,
      decryptedValue: value,
      hiddenValue: "*",
      hidden: true,
    };

    secrets.push(secret);
  });

  return secrets;
};

// Borrowed from https://github.com/motdotla/dotenv/blob/master/lib/main.js
const LINE =
  /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
const parse = (src: string) => {
  const obj = {};

  // Convert buffer to string
  let lines = src.toString();

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/gm, "\n");

  let match;
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1];

    // Default undefined or null to empty string
    let value = match[2] || "";

    // Remove whitespace
    value = value.trim();

    // Check if double quoted
    const maybeQuote = value[0];

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, "\n");
      value = value.replace(/\\r/g, "\r");
    }

    // Add to object
    obj[key] = value;
  }

  return obj;
};
