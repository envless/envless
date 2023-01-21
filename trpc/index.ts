import { createRouter } from "@/trpc/router";
import { account } from "@/trpc/routes/account";
// import all sub-routers
import { auth } from "@/trpc/routes/auth";
import { projects } from "@/trpc/routes/projects";
import { requestAccess } from "@/trpc/routes/requestAccess";
import { twoFactor } from "@/trpc/routes/twoFactor";

export const appRouter = createRouter({
  auth,
  account,
  projects,
  twoFactor,
  requestAccess,
});

// export type definition of API
export type AppRouter = typeof appRouter;
