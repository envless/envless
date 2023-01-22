import { authenticator } from "otplib";
import { decrypt } from "@/lib/encryption";

const ENCRYPTION_KEY = String(process.env.ENCRYPTION_KEY);

interface VerifyTypes {
  code: string;
  secret: any;
}

const verify = async ({ code, secret }: VerifyTypes) => {
  const encrypted = Object.assign({}, secret) as {
    ciphertext: string;
    iv: string;
    tag: string;
  };

  const decrypted = await decrypt({
    ...encrypted,
    key: ENCRYPTION_KEY,
  });

  const isValid = await authenticator.verify({
    token: code,
    secret: decrypted,
  });

  return isValid;
};

const TwofactorAuth = {
  verify,
};

export default TwofactorAuth;
