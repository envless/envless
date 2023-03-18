import { describe, expect, it } from "vitest";
import { decrypt, encrypt } from "../../lib/encryption";

describe("encrypt/decrypt", () => {
  it("should correctly encrypt and decrypt a message", async () => {
    const plaintext = "hello world";
    const key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const encrypted = await encrypt({ plaintext, key });
    const decrypted = await decrypt({ ...encrypted, key });
    expect(decrypted).toBe(plaintext);
  });

  it("should throw an error when trying to decrypt with an incorrect key", async () => {
    const plaintext = "hello world";
    const key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const wrongKey = "WrongKey123";
    const encrypted = await encrypt({ plaintext, key });
    await expect(async () => {
      await decrypt({ ...encrypted, key: wrongKey });
    }).rejects.toThrowError();
  });
});
