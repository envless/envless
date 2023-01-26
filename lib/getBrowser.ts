import isBot from "isbot";
import UAParser from "ua-parser-js";

const parser = new UAParser();

export const getBrowser = async (userAgent: string) => {
  const result = await parser.getResult();

  console.log("result", result, userAgent);

  return {
    os: result.os,
    bot: isBot(userAgent),
    device: result.device,
    browser: result.browser,
  };
};
