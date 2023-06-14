import * as argon2 from "argon2-browser";
import { randomBytes } from "crypto";
import * as openpgp from "openpgp";
import { generageKeyPair } from "@/lib/encryption/openpgp";

export const generatePassword = async (length: number) => {
  let generatedPassword = "";

  const validChars =
    "0123456789" +
    "abcdefghijklmnopqrstuvwxyz" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "!#$%&()*+,-./:;<=>?@[\\]^_{|}~";

  for (let i = 0; i < length; i++) {
    let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];
    randomNumber = randomNumber / 0x100000000;
    randomNumber = Math.floor(randomNumber * validChars.length);

    generatedPassword += validChars[randomNumber];
  }

  return generatedPassword;
};

export const generateTempKeychain = async (name: string, email: string) => {
  const keypair = await generageKeyPair(name as string, email);
  const pass = await generatePassword(24);
  const salt = randomBytes(32).toString("hex");

  const { publicKey, privateKey, revocationCertificate } = keypair;

  const hashedPassword = await argon2.hash({
    pass,
    salt,
    type: argon2.ArgonType.Argon2id,
  });

  const encodedPrivateKey = new TextEncoder().encode(privateKey as string);

  const message = await openpgp.createMessage({ binary: encodedPrivateKey });

  const tempEncryptedPrivateKey = await openpgp.encrypt({
    message,
    passwords: [pass],
    format: "armored",
  });

  return {
    publicKey,
    revocationCertificate,
    tempEncryptedPrivateKey,
    hashedPassword: hashedPassword.encoded,
  };
};
