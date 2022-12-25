import { createRouter } from "@/trpc/router";

// import all sub-routers
import { projects } from "@/trpc/routes/projects";

export const appRouter = createRouter({
  projects,
});

// export type definition of API
export type AppRouter = typeof appRouter;
