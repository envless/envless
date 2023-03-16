import nacl from "tweetnacl";
import pkg from "tweetnacl-util";

const generateKeyPair = async () => {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: pkg.encodeBase64(keyPair.publicKey),
    secretKey: pkg.encodeBase64(keyPair.secretKey),
  };
};

const encrypt = async ({ plaintext, key }) => {};

const decrypt = async ({ ciphertext, iv, tag, key }) => {};

export { encrypt, decrypt, generateKeyPair };
