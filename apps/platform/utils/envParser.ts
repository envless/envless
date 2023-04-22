import { encryptString } from "@47ng/cloak";
import { EnvSecret } from "@/types/index";
import { parseDotEnvContents } from "@/utils/helpers";
import yaml from "js-yaml";
import { repeat } from "lodash";
import { showToast } from "@/components/theme/showToast";

export const parseEnvFile = async (file: File, decryptedProjectKey: string) => {
  const fileContents = await readFileContents(file);

  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

  const pairs = await parseEnvContent(
    fileExtension,
    fileContents,
    decryptedProjectKey,
  );
  return pairs;
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

export const parseEnvContent = async (
  fileExtension: string,
  contents: string,
  decryptedProjectkey: string,
) => {
  let secrets: EnvSecret[] = [];

  switch (fileExtension) {
    case "env":
      const pairs = parseDotEnvContents(contents);
      const keyPairEntries = Object.entries(pairs);

      for (let i = 0; i < keyPairEntries.length; i++) {
        const [key, value] = keyPairEntries[i];

        const encryptedKey = await encryptString(key, decryptedProjectkey);
        const encryptedValue = await encryptString(
          value as string,
          decryptedProjectkey,
        );

        const secret = {
          encryptedKey,
          encryptedValue,
          decryptedKey: key as string,
          decryptedValue: value as string,
          hiddenValue: repeat("*", (value as string).length),
          hidden: true,
        };

        secrets.push(secret);
      }
      break;

    case "yml":
      try {
        const yamlPairs = yaml.load(contents);

        const traverseAndConvertYml = async (
          pairs,
          result: EnvSecret[] = [],
          parentKey = "",
        ) => {
          if (typeof pairs !== "object" || Array.isArray(pairs)) {
            result[parentKey] = pairs;

            const encryptedKey = await encryptString(
              parentKey,
              decryptedProjectkey,
            );
            const encryptedValue = await encryptString(
              pairs as string,
              decryptedProjectkey,
            );

            const envSecret = {
              id: "",
              encryptedKey,
              encryptedValue,
              hiddenValue: repeat("*", String(pairs).length),
              decryptedKey: parentKey,
              decryptedValue: pairs,
              hidden: true,
            };
            result.push(envSecret);
          } else {
            for (const [key, value] of Object.entries(pairs)) {
              const newParentKey = parentKey ? `${parentKey}_${key}` : key;
              await traverseAndConvertYml(value, result, newParentKey);
            }
          }

          return result;
        };

        secrets = await traverseAndConvertYml(yamlPairs);
      } catch (err) {
        if (err.reason === "duplicated mapping key") {
          showToast({
            title: "Duplicate Key",
            subtitle: "Your uploaded YAML file contains duplicate keys",
            type: "error",
            duration: 2000,
          });
        }
      }
      break;

    case "json":
      const jsonPairs = JSON.parse(contents);

      const traverseAndConvertJson = async (
        pairs,
        result: EnvSecret[] = [],
        parentKey = "",
      ) => {
        if (typeof pairs !== "object" || Array.isArray(pairs)) {
          result[parentKey] = pairs;

          const encryptedKey = await encryptString(
            parentKey,
            decryptedProjectkey,
          );
          const encryptedValue = await encryptString(
            pairs as string,
            decryptedProjectkey,
          );

          const envSecret = {
            id: "",
            encryptedKey,
            encryptedValue,
            hiddenValue: repeat("*", String(pairs).length),
            decryptedKey: parentKey,
            decryptedValue: pairs,
            hidden: true,
          };
          result.push(envSecret);
        } else {
          for (const [key, value] of Object.entries(pairs)) {
            const newParentKey = parentKey ? `${parentKey}_${key}` : key;
            await traverseAndConvertJson(value, result, newParentKey);
          }
        }

        return result;
      };

      secrets = await traverseAndConvertJson(jsonPairs);

      break;
  }

  return secrets;
};

export const attemptToParseCopiedSecrets = async (
  copiedContent: string,
  decryptedProjectKey: string,
) => {
  let parsedContent: EnvSecret[] = [];

  if (parsedContent.length === 0) {
    try {
      parsedContent = await parseEnvContent(
        "json",
        copiedContent,
        decryptedProjectKey,
      );
    } catch (error) {}
  }

  if (parsedContent.length === 0) {
    try {
      parsedContent = await parseEnvContent(
        "yml",
        copiedContent,
        decryptedProjectKey,
      );
    } catch (error) {}
  }

  if (parsedContent.length === 0) {
    try {
      parsedContent = await parseEnvContent(
        "env",
        copiedContent,
        decryptedProjectKey,
      );
    } catch (error) {}
  }

  return parsedContent;
};
