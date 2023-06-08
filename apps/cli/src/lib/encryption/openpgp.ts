const openpgp = require("openpgp");

/**
Encrypts a plaintext with the given public keys using OpenPGP.
@param plaintext - The plaintext message to encrypt.
@param publicKeys - An array of public keys to use for encryption.
@returns The encrypted message as a string.
*/
const encrypt = async (plaintext: string, publicKeys: string[]) => {
  const readPublicKeys = await Promise.all(
    publicKeys.map((armoredKey) => openpgp.readKey({ armoredKey })),
  );

  const message = await openpgp.createMessage({ text: plaintext });

  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: readPublicKeys,
  });

  return encrypted;
};

/**
Decrypts an OpenPGP-encrypted message with the given private key.
@param encrypted - The encrypted message to decrypt.
@param privateKey - The private key to use for decryption.
@returns The decrypted message as a string.
*/
const decrypt = async (encrypted: string, privateKey: string) => {
  const readPrivateKey = await openpgp.readPrivateKey({
    armoredKey: privateKey,
  });

  const readEncrypted = await openpgp.readMessage({
    armoredMessage: encrypted,
  });

  const { data: decrypted } = await openpgp.decrypt({
    message: readEncrypted,
    decryptionKeys: readPrivateKey,
  });

  return decrypted;
};

/**
Revokes OpenPGP key used to encrypt/decrypt a plaintext.
@param publicKey - The public key used for encryption.
@param revocationCertificate - The revocation certificate to use.
@returns The revoked key as an armored string.
*/
const revokeKey = async (publicKey: string, revocationCertificate: string) => {
  const { publicKey: revokedKeyArmored } = await openpgp.revokeKey({
    key: await openpgp.readKey({ armoredKey: publicKey }),
    revocationCertificate,
    format: "armored",
  });

  return revokedKeyArmored;
};

/**
Generates a new OpenPGP key pair and revocationCertificate.
@param name - The name of the user this key pair belongs to.
@param email - The email address of the user thiskey pair belongs to.
@returns An object containing the generated public key, private key, and revocation certificate.
*/
export const generageKeyPair = async (name: string, email: string) => {
  const { publicKey, privateKey, revocationCertificate } =
    await openpgp.generateKey({
      type: "ecc",
      curve: "curve25519",
      userIDs: [{ name, email }],
      format: "armored",
    });

  return {
    publicKey,
    privateKey,
    revocationCertificate,
  };
};

const OpenPGP = {
  encrypt,
  decrypt,
  revokeKey,
  generageKeyPair,
};

export default OpenPGP;
