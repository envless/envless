import * as keytar from "keytar";

const fs = require("fs");

const downloadsFolder = require("downloads-folder");

export const saveToKeyStore = async (key: object) => {
  let keyRing;
  keyRing = await keytar.getPassword("envless", "cli" as string);

  if (!keyRing) {
    keyRing = [key];
  } else {
    keyRing = JSON.parse(keyRing);
    keyRing.push(key);
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
