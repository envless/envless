import { decryptString } from "@47ng/cloak";
import { cancel, spinner } from "@clack/prompts";
import { bold, cyan } from "kleur/colors";
import OpenPGP from "../lib/encryption/openpgp";
import { getPrivateKeyFromKeyStore } from "../lib/keyStore";
import type { DecryptedSecretType, EncryptedSecretType } from "../utils/types";
import { getCliConfigFromKeyStore } from "./keyStore";

export const triggerCancel = (message: string = "") => {
  cancel(message);
  process.exit(0);
};

export const isValidEmail = (email: string) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(String(email).toLowerCase());
};

export const getCliConfig = async () => {
  const config = await getCliConfigFromKeyStore();

  const cliId = process.env.ENVLESS_CLI_ID || config?.id;
  const cliToken = process.env.ENVLESS_CLI_TOKEN || config?.token;

  return {
    cliId,
    cliToken,
  };
};

export const ENVLESS_PLATFORM_URL =
  process.env.ENVLESS_PLATFORM_URL || "http://localhost:3000";

export const LINKS = {
  base: ENVLESS_PLATFORM_URL,
  api: `${ENVLESS_PLATFORM_URL}/api`,
  login: `${ENVLESS_PLATFORM_URL}/auth`,
  projects: `${ENVLESS_PLATFORM_URL}/projects`,
  docs: "https://envless.dev/docs",
  devCliDocs: "https://envless.dev/docs/cli/development",
  prodCliDocs: "https://envless.dev/docs/cli/production",
};

export const API_VERSION = "v1";

export async function decryptProjectKey(encryptedProjectKey: string) {
  const loader = spinner();

  const privateKey =
    process.env.ENVLESS_PRIVATE_KEY || (await getPrivateKeyFromKeyStore());

  if (!privateKey) {
    loader.stop(
      `Private key not found. Please make sure you completed Envless CLI setup before running this command. Please follow the instructions at: \n\nFor development environment\n  ${bold(
        cyan(`${LINKS.devCliDocs}`),
      )}\n\nFor production and CI/CD\n  ${bold(cyan(`${LINKS.prodCliDocs}`))}`,
    );

    triggerCancel();
  }

  try {
    const decryptedProjectKey = await OpenPGP.decrypt(
      encryptedProjectKey,
      privateKey as string,
    );

    return decryptedProjectKey;
  } catch (error) {
    loader.stop(
      `Unable to decrypt project key. Please make sure you completed Envless CLI setup before running this command. Please follow the instructions at: \n\nFor development environment\n  ${bold(
        cyan(`${LINKS.devCliDocs}`),
      )}\n\nFor production and CI/CD\n  ${bold(cyan(`${LINKS.prodCliDocs}`))}`,
    );

    triggerCancel();
  }
}

export async function decryptSecrets(
  encryptedSecrets: EncryptedSecretType[],
  decryptedProjectKey: string,
) {
  return await Promise.all(
    encryptedSecrets.map(async (encryptedSecret: EncryptedSecretType) => {
      const { id, encryptedKey, encryptedValue } = encryptedSecret;

      try {
        const key = await decryptString(encryptedKey, decryptedProjectKey);
        const value = await decryptString(encryptedValue, decryptedProjectKey);
        return {
          id,
          key,
          value,
          uuid: encryptedSecret.uuid,
        } as DecryptedSecretType;
      } catch (error) {
        triggerCancel();
      }
    }),
  );
}
