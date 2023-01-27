import { type GetServerSidePropsContext } from "next";
import { type NextRequest } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import requestIp from "request-ip";
import redis from "@/lib/redis";
import { getBrowser } from "@/lib/uaParser";

export const getServerSideSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};

export const logSession = async (
  session: any,
  req: GetServerSidePropsContext["req"],
) => {
  const headers = req.headers;
  const ip = requestIp.getClientIp(req);
  const userAgent = headers["user-agent"] as string;
  const browser = await getBrowser(userAgent);
  const { user, sessionId } = session;

  const redisSession = await redis.get(`session:${sessionId}`);
  console.log("Logging session", { userAgent });

  // console.log("Logging session", { ip, browser })

  // get geo data from ip address
  // const geoData = await getGeoData(ip);

  // const fingerprint = await getFingerprint(req);
  // const session = await redis.get(`session:${fingerprint}`);
  // const sessionData = JSON.parse(session);
  // const { user, sessionId } = sessionData;
  // const { id, email } = user;
  // const sessionHistory = await redis.get(`sessionHistory:${sessionId}`);
  // const sessionHistoryData = JSON.parse(sessionHistory);
  // const { ip: sessionIp, device: sessionDevice } = sessionHistoryData;

  // if (ip !== sessionIp) {
  //   await redis.set(`sessionHistory:${sessionId}`, {
  //     ...sessionHistoryData,
  //     ip,
  //   });
  // }

  // if (device.name !== sessionDevice.name) {
  //   await redis.set(`sessionHistory:${sessionId}`, {
  //     ...sessionHistoryData,
  //     device,
  //   });
  // }
};
