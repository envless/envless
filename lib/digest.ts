/**
 * @param {string} plaintext
 * @returns {string}
 * @example
 * const plaintext = 'Hello, world!';
 * const hash = await digest({ plaintext });
 * console.log(hash);
 * => 'b10a8db164e0754105b7a99be72e3fe5'
 */

export const digest = async ({ plaintext }: { plaintext: string }) => {
  const text = new TextEncoder().encode(plaintext);
  const digest = await crypto.subtle.digest("SHA-256", text);
  const hash = Array.from(new Uint8Array(digest));
  const hex = hash.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hex;
};
