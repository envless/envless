import { NextApiRequest } from "next";
import { getServerSideSession } from "@/utils/session";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import prisma from "@/lib/prisma";

type CreateContextOptions = {
  session: Session | null;
  req: NextApiRequest;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    req: opts.req,
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerSideSession(opts);

  return await createContextInner({
    req,
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
