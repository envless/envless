import { createRouter } from "@/trpc/router";
import { account } from "@/trpc/routes/account";
// import all sub-routers
import { auth } from "@/trpc/routes/auth";
import { branches } from "@/trpc/routes/branch";
import { cli } from "@/trpc/routes/cli";
import { members } from "@/trpc/routes/members";
import { projectKey } from "@/trpc/routes/projectKey";
import { projects } from "@/trpc/routes/projects";
import { pullRequest } from "@/trpc/routes/pullRequest";
import { twoFactor } from "@/trpc/routes/twoFactor";
import { auditLogs } from "./routes/auditLog";
import { secrets } from "./routes/secret";

export const appRouter = createRouter({
  cli,
  auth,
  account,
  projects,
  members,
  twoFactor,
  branches,
  pullRequest,
  auditLogs,
  secrets,
  projectKey,
});

// export type definition of API
export type AppRouter = typeof appRouter;
