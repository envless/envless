import { buildSendMail } from "mailing-core";
import nodemailer from "nodemailer";

const sendMail = buildSendMail({
  transport: nodemailer.createTransport({
    host: String(process.env.SMTP_HOST) || "localhost",
    port: Number(process.env.SMTP_PORT) || 1025,
    auth: {
      user: String(process.env.SMTP_USERNAME) || "username",
      pass: String(process.env.SMTP_PASSWORD) || "password",
    },
  }),
  defaultFrom: String(process.env.EMAIL_FROM) || "",
  configPath: "../mailing.config.json",
});

export default sendMail;
