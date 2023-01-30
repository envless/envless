import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL as string;
const token = process.env.UPSTASH_REDIS_REST_TOKEN as string;
const redis = new Redis({ url, token });
export default redis;
