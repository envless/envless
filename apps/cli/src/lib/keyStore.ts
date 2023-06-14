import * as keytar from "@makepro-x/keytar";

const fs = require("fs");

const downloadsFolder = require("downloads-folder");

export const getCliConfigFromKeyStore = async () => {
  const cli = await keytar.getPassword("envless", "cli" as string);
  return JSON.parse(cli as string);
};

export const saveCliConfigToKeyStore = async (cli: object) => {
  await deleteCliConfigFromKeyStore();
  await keytar.setPassword("envless", "cli" as string, JSON.stringify(cli));
};

export const getPrivateKeyFromKeyStore = async () => {
  return await keytar.getPassword("envless", "privateKey" as string);
};

export const getPrivateKeyFromDownloadsFolder = async () => {
  const filePath = `${downloadsFolder()}/envless.key`;
  return fs.readFileSync(filePath, "utf8");
};

export const deletePrivateKeyFromDownloadsFolder = async () => {
  const filePath = `${downloadsFolder()}/envless.key`;

  if (fs.existsSync(filePath)) {
    await fs.rmSync(filePath);
  }
};

export const savePrivateKeyToKeyStore = async (privateKey: string) => {
  return await keytar.setPassword("envless", "privateKey", privateKey);
};

export const deleteCliConfigFromKeyStore = async () => {
  await keytar.deletePassword("envless", "cli" as string);
};

export const deletePrivateKeyFromKeyStore = async () => {
  await keytar.deletePassword("envless", "privateKey" as string);
};
