import { parse, stringify } from "envfile";
import { EnvVariable } from "@/components/projects/EnvironmentVariableEditor";

export const parseEnvFile = async (file: File, setEnvKeys) => {
  const reader = new FileReader();

  const readFile = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  });

  reader.readAsText(file, "UTF-8");
  const contents = await readFile as string;
  const pairs = await parseEnvContent(contents)
  setEnvKeys([...pairs]);
}

export const parseEnvContent = async (contents: string) => {
  const pairs = parse(contents);
  const keyValues: EnvVariable[] = [];

  Object.keys(pairs).forEach((key) => {
    const value = pairs[key];
    const keyValue = {
      envKey: key,
      envValue: value,
      hidden: true,
    }

    keyValues.push(keyValue);
  })

  return keyValues;
}
