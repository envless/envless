import DeviceDetector from "device-detector-js";
import BotDetector from "device-detector-js/dist/parsers/bot";

export const getBrowser = async (userAgent: string) => {
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.parse(userAgent);

  return device;
};

export const getBot = async (userAgent: string) => {
  const botDetector = new BotDetector();
  const bot = botDetector.parse(userAgent);

  return bot;
};
