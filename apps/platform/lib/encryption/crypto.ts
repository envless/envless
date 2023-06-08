export const generatePassword = async (length: number) => {
  let generatedPassword = "";

  const validChars =
    "0123456789" +
    "abcdefghijklmnopqrstuvwxyz" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "!#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

  for (let i = 0; i < length; i++) {
    let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];
    randomNumber = randomNumber / 0x100000000;
    randomNumber = Math.floor(randomNumber * validChars.length);

    generatedPassword += validChars[randomNumber];
  }

  return generatedPassword;
};
