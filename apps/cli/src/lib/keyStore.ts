import * as keytar from "keytar";

const fs = require("fs");
const downloadsFolder = require("downloads-folder");

export const getCliConfigFromKeyStore = async () => {
  const cli = await keytar.getPassword("envless", "cli" as string);
  return JSON.parse(cli as string);
};

export const saveCliConfigToKeyStore = async (cli: object) => {
  let keyRing;
  keyRing = await keytar.getPassword("envless", "cli" as string);

  if (!keyRing) {
    keyRing = [cli];
  } else {
    keyRing = JSON.parse(keyRing);
    keyRing.push(cli);
  }

  await keytar.setPassword("envless", "cli" as string, JSON.stringify(keyRing));
};

export const getPrivateKeyFromKeyStore = async () => {
  return await keytar.getPassword("envless", "privateKey" as string);
};

export const savePrivateKeyToKeyStore = async () => {
  let privateKey = await getPrivateKeyFromKeyStore();

  if (!privateKey) {
    const filePath = `${downloadsFolder()}/envless.key`;
    privateKey = fs.readFileSync(filePath, "utf8");
    await keytar.setPassword("envless", "privateKey", privateKey as string);
  }

  return privateKey;
};
