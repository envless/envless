import { appRouter } from "@/trpc/index";
import { createContext } from "@/trpc/context";
import { createNextApiHandler } from "@trpc/server/adapters/next";

export const config = {
  runtime: "experimental-edge",
};

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});
