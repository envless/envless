import { env } from "@/env/server.mjs";

const dev = env.NODE_ENV !== "production";

const log = (...args) => {
  if (dev && env.DEV_LOG) console.debug(args);
};

export default log;
