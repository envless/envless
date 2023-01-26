import crypto from "crypto";

/**
 * The algorithm used for encryption and decryption.
 */
const algorithm = "aes-256-gcm";

/**
 * Interface for the encrypt function.
 *
 * @interface EncryptInterface
 * @property {string} plaintext - The plaintext to be encrypted.
 * @property {string} key - The encryption key.
 */
interface EncryptInterface {
  plaintext: string;
  key: string;
}

/**
 * Interface for the decrypt function.
 *
 * @interface DecryptInterface
 * @property {string} ciphertext - The ciphertext to be decrypted.
 * @property {string} iv - The initialization vector.
 * @property {string} tag - The authentication tag.
 * @property {string} key - The decryption key.
 */
interface DecryptInterface {
  ciphertext: string;
  iv: string;
  tag: string;
  key: string;
}

/**
 * Encrypts a given plaintext using the specified key and algorithm.
 *
 * @function
 * @async
 * @param {EncryptInterface} - An object containing the plaintext and key.
 * @returns {Promise<{ciphertext: string, iv: string, tag: string}>} - An object containing the ciphertext, initialization vector, and authentication tag.
 */
export const encrypt = async ({ plaintext, key }: EncryptInterface) => {
  const iv = crypto.subtle.randomBytes(16);
  const cipher = crypto.subtle.createCipheriv(algorithm, key, iv);

  let ciphertext = cipher.update(plaintext, "utf8", "base64");
  ciphertext += cipher.final("base64");

  return {
    ciphertext,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
};

/**
 * Decrypts a given ciphertext using the specified key, initialization vector, and authentication tag.
 *
 * @function
 * @async
 * @param {DecryptInterface} - An object containing the ciphertext, initialization vector, and authentication tag.
 * @returns {Promise<string>} - The decrypted plaintext.
 */
export const decrypt = async ({
  ciphertext,
  iv,
  tag,
  key,
}: DecryptInterface) => {
  const decipher = crypto.subtle.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));

  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
