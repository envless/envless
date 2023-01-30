import { type GetServerSidePropsContext } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import requestIp from "request-ip";
import log from "@/lib/log";
import redis from "@/lib/redis";

export const getServerSideSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};
