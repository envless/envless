import { env } from "@/env/index.mjs";
import { Redis } from "@upstash/redis";

const url = env.UPSTASH_REDIS_REST_URL;
const token = env.UPSTASH_REDIS_REST_TOKEN;
const redis = new Redis({ url, token });
export default redis;
