import { createRouter } from "@/trpc/router";
import { account } from "@/trpc/routes/account";
// import all sub-routers
import { auth } from "@/trpc/routes/auth";
import { branches } from "@/trpc/routes/branch";
import { cli } from "@/trpc/routes/cli";
import { keys } from "@/trpc/routes/keys";
import { members } from "@/trpc/routes/members";
import { projects } from "@/trpc/routes/projects";
import { pullRequest } from "@/trpc/routes/pullRequest";
import { twoFactor } from "@/trpc/routes/twoFactor";
import { auditLogs } from "./routes/auditLog";

export const appRouter = createRouter({
  cli,
  keys,
  auth,
  account,
  projects,
  members,
  twoFactor,
  branches,
  pullRequest,
  auditLogs,
});

// export type definition of API
export type AppRouter = typeof appRouter;
