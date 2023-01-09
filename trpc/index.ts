import { createRouter } from "@/trpc/router";

// import all sub-routers
import { projects } from "@/trpc/routes/projects";
import { twoFactor } from "@/trpc/routes/twoFactor";

export const appRouter = createRouter({
  projects,
  twoFactor,
});

// export type definition of API
export type AppRouter = typeof appRouter;
