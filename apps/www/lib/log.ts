const log = (...args) => {
  if (process.env.NODE_ENV === "development") {
    const json = JSON.stringify(args);
    console.debug(`[ENVLESS DEV LOG]: ${json}`);
  }
};

export default log;
