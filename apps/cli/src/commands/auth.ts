import { cancel, isCancel, select, spinner, text, intro } from "@clack/prompts";
import { Command, Flags, ux } from "@oclif/core";
import axios from "axios";
import * as keytar from "keytar";
import OpenPGP from "../lib/encryption/openpgp.js";
import { isValidEmail } from "../lib/helpers.js";

const gradient = require("gradient-string");
const API_BASE = process.env.API_BASE || `http://localhost:3000`;
const ENDPOINT = `${API_BASE}/api/cli/login`;

const loader = spinner();
export default class Auth extends Command {
  static description = "Login to Envless or create an account";

  static flags = {
    with: Flags.string({
      char: "w",
      options: ["email", "github", "gitlab"],
    }),
  };

  static examples = [
    `
      $ envless auth
      $ envless auth --with email
      $ envless auth --with github
      $ envless auth --with gitlab
    `,
  ];

  async run(): Promise<void> {
    console.log(
      gradient(
        "#ccfbf1",
        "#5eead4",
        "#06b6d4",
      )(`👋 Welcome to Envless CLI 0.0.4`), // TODO: Get version from config.
    );

    const { flags } = await this.parse(Auth);
    let provider = flags.with;
    if (!provider) {
      const response: any = await select({
        message: "Login to Envless or create an account",
        options: [
          { label: "Continue with Email", value: "email" },
          { label: "Continue with GitHub", value: "github" },
          { label: "Continue with GitLab", value: "gitlab" },
        ],
      });

      isCancel(response) && triggerCancel();
      provider = response;

      // loader.start(loginUrl);
    }

    const loginUrl = `${API_BASE}/api/cli/auth/${provider}`;

    this.log("Please visit the following URL in your web browser:");
    this.log(loginUrl);

    // if (provider === "email") {
    //   const email = await text({
    //     message: "Enter your email address",
    //     placeholder: "your@email.com",
    //     validate(value) {
    //       if (!isValidEmail(value)) {
    //         return `Please enter a valid email address`;
    //       }
    //     },
    //   });

    //   isCancel(email) && triggerCancel();
    //   loader.start("Authenticating...");
    //   await new Promise((r) => setTimeout(r, 2000));
    //   loader.stop("We have sent you an email.");
    //   loader.start("Please check your inbox for a verification link.");
    //   await new Promise((r) => setTimeout(r, 2000));
    //   loader.stop();
    // }

    // if (provider === "github") {
    // }

    // if (provider === "gitlab") {
    // }
  }
}

const triggerCancel = () => {
  cancel("Opeartion cancelled");
  process.exit(0);
};

const handleKeyChain = async (email: string) => {
  const publicKey = await keytar.getPassword("envless", "publicKey");
  const privateKey = await keytar.getPassword("envless", "privateKey");

  if (!publicKey || !privateKey) {
    const pgp = await OpenPGP.generageKeyPair("CLI", email);
    await keytar.setPassword("envless", "publicKey", pgp.publicKey);
    await keytar.setPassword("envless", "privateKey", pgp.privateKey);
  }
};
