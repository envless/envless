const dev = process.env.NODE_ENV !== "production";
const devLog = process.env.DEV_LOG === "true";

const log = (...args) => {
  if (dev && devLog) console.debug(args);
};

export default log;
