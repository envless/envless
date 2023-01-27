const dev = process.env.NODE_ENV !== "production";
const disable = process.env.DISABLE_DEV_LOG === "true";

const log = (...args) => {
  if (dev && !disable) console.log(args);
};

export default log;
