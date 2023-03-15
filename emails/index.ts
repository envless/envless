import { env } from "@/env/index.mjs";
import { buildSendMail } from "mailing-core";
import nodemailer from "nodemailer";

const sendMail = buildSendMail({
  transport: nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
  }),
  defaultFrom: env.EMAIL_FROM,
  configPath: "../mailing.config.json",
});

export default sendMail;
