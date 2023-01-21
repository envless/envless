import { createRouter } from "@/trpc/router";
// import all sub-routers
import { account } from "@/trpc/routes/account";
import { projects } from "@/trpc/routes/projects";
import { requestAccess } from "@/trpc/routes/requestAccess";
import { twoFactor } from "@/trpc/routes/twoFactor";

export const appRouter = createRouter({
  account,
  projects,
  twoFactor,
  requestAccess,
});

// export type definition of API
export type AppRouter = typeof appRouter;
