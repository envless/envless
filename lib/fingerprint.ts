import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const getFingerprint = async () => {
  const sdk = await FingerprintJS.load();
  const result = await sdk.get();
  const fingerprint = result.visitorId;
  return fingerprint;
};
