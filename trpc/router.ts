import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import { type Context } from "@/trpc/context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const withoutAuth = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 **/
export const withAuth = t.procedure.use(isAuthenticated);
