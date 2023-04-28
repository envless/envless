import isbot from "isbot";
import requestIp from "request-ip";
import UAParser from "ua-parser-js";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const getFingerprint = async () => {
  const sdk = await FingerprintJS.load();
  const result = await sdk.get();
  const fingerprint = result.visitorId;
  return fingerprint;
};

export const parseUserAgent = async (userAgent: string) => {
  const parser = await new UAParser(userAgent);
  const result = await parser.getResult();
  return result;
};

export const getClientDetails = async (req: any) => {
  const { headers } = req;
  const { "user-agent": userAgent } = headers;
  const client = await parseUserAgent(userAgent);

  return {
    ip: requestIp.getClientIp(req),
    isBot: isbot(userAgent),
    geo: req.geo || {},
    ...client,
  };
};
