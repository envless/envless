import { EnvVariable } from "@/components/projects/EnvironmentVariableEditor";

export const parseEnvFile = async (file: File, setEnvKeys) => {
  const reader = new FileReader();

  const readFile = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  });

  reader.readAsText(file, "UTF-8");
  const contents = (await readFile) as string;
  const pairs = await parseEnvContent(contents);
  setEnvKeys([...pairs]);
};

export const parseEnvContent = async (contents: string) => {
  const pairs = parse(contents);
  const keyValues: EnvVariable[] = [];

  Object.keys(pairs).forEach((key) => {
    const value = pairs[key];
    const keyValue = {
      envKey: key,
      envValue: value,
      hidden: true,
    };

    keyValues.push(keyValue);
  });

  return keyValues;
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
