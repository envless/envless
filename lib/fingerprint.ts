import { digest } from "@/lib/digest";

export const getFingerprint = async (data: {
  ip: string;
  userAgent: string;
  userId: string;
}) => {
  const { ip, userAgent, userId } = data;
  const plaintext = `userId:${userId}-ip:${ip}-ua:${userAgent}`;
  const fingerprint = await digest({ plaintext });
  return fingerprint;
};
