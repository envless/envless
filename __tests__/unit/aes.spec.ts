import { describe, expect, it } from "vitest";
import AES from "../../lib/encryption/aes";

describe("encrypt/decrypt", () => {
  it("should correctly encrypt and decrypt a message", async () => {
    const plaintext = "hello world";
    const key = await AES.generateKey();
    const encrypted = await AES.encrypt({ plaintext, key });
    const decrypted = await AES.decrypt({ ...encrypted, key });
    expect(decrypted).toBe(plaintext);
  });

  it("should throw an error when trying to decrypt with an incorrect key", async () => {
    const plaintext = "hello world";
    const key = await AES.generateKey();
    const wrongKey = await AES.generateKey();
    const encrypted = await AES.encrypt({ plaintext, key });
    await expect(async () => {
      await AES.decrypt({ ...encrypted, key: wrongKey });
    }).rejects.toThrowError();
  });
});
