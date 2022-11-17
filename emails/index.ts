import nodemailer from "nodemailer";
import { buildSendMail } from "mailing-core";

const sendMail = buildSendMail({
  transport: nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  }),
  defaultFrom: process.env.EMAIL_FROM,
  configPath: "../mailing.config.json",
});

export default sendMail;
