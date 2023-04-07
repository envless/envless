import { env } from "@/env/index.mjs";

const log = (...args) => {
  if (env.NEXT_PUBLIC_DEV_LOG) console.debug(args);
};

export default log;
