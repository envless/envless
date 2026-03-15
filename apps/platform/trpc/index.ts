import { createRouter } from "@/trpc/router";
import { account } from "@/trpc/routes/account";
// import all sub-routers
import { auth } from "@/trpc/routes/auth";
import { branches } from "@/trpc/routes/branch";
import { members } from "@/trpc/routes/members";
import { projectKey } from "@/trpc/routes/projectKey";
import { projects } from "@/trpc/routes/projects";
import { pullRequest } from "@/trpc/routes/pullRequest";
import { serviceAccount } from "@/trpc/routes/serviceAccount";
import { twoFactor } from "@/trpc/routes/twoFactor";
import { auditLogs } from "./routes/auditLog";
import { secrets } from "./routes/secret";

export const appRouter = createRouter({
  auth,
  account,
  members,
  secrets,
  projects,
  branches,
  twoFactor,
  auditLogs,
  projectKey,
  pullRequest,
  serviceAccount,
});

// export type definition of API
export type AppRouter = typeof appRouter;
