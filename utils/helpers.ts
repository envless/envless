import { EnvVariable } from "@/components/projects/EnvironmentVariableEditor";

export const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleString("en-us", {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const extractEnvKeyValuePair = (contents: string) =>
  contents.match(/\b(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)/gm) ?? [""];

export const parseEnvFile = (
  file: File,
  onLoaded: (pairs: EnvVariable[]) => void,
) => {
  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");

  reader.onload = (event) => {
    const contents = event.target?.result as string;
    let keyValuePairs = parseStringEnvContents(event.target?.result as string);
    onLoaded(keyValuePairs);
  };
};

export const parseStringEnvContents = (contents: string) => {
  const keyValuePairs: EnvVariable[] = [];
  const keys = extractEnvKeyValuePair(contents);
  keys.forEach((envKey) => {
    const keyPair = envKey.split("=");
    keyValuePairs.push({
      envKey: keyPair[0],
      envValue: keyPair[1],
      hidden: true,
    });
  });
  return keyValuePairs;
};
