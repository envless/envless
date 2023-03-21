import { createRouter } from "@/trpc/router";
import { account } from "@/trpc/routes/account";
// import all sub-routers
import { auth } from "@/trpc/routes/auth";
import { branches } from "@/trpc/routes/branch";
import { keys } from "@/trpc/routes/keys";
import { members } from "@/trpc/routes/members";
import { projects } from "@/trpc/routes/projects";
import { pullRequest } from "@/trpc/routes/pullRequest";
import { twoFactor } from "@/trpc/routes/twoFactor";

export const appRouter = createRouter({
  keys,
  auth,
  account,
  projects,
  members,
  twoFactor,
  branches,
  pullRequest,
});

// export type definition of API
export type AppRouter = typeof appRouter;
