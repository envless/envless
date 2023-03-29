// TODO: Complete auth implementation
import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import { Command, Flags, ux } from "@oclif/core";
import * as keytar from "keytar";
import { blue, bold, cyan, grey, underline, yellow } from "kleur/colors";
import OpenPGP from "../lib/encryption/openpgp.js";
import { isValidEmail } from "../lib/helpers.js";

const API_BASE = process.env.API_BASE || `http://localhost:3000`;
const ENDPOINT = `${API_BASE}/api/cli/login`;
const opn = require("better-opn");

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
    const version = this.config.version;
    await intro(`👋 ${bold(cyan(`Welcome to Envless ${grey(`${version}`)}`))}`);

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
    }

    const loginUrl = `${API_BASE}/auth?clientId=xxx`;
    await loader.start(`Please wait while verify few things...`);
    await new Promise((r) => setTimeout(r, 2000));
    await loader.stop(
      `Please visit this URL in your web browser: ${underline(
        blue(`${loginUrl}`),
      )}`,
    );
    await opn(loginUrl);

    const token = await text({
      message: "Please enter your verification token",
      placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      validate: (input: string) => {
        if (!input || input.trim() === "" || input.trim().length < 10) {
          return `Please enter a valid verification token`;
        }
      },
    });

    isCancel(token) && triggerCancel();
    await outro(
      `👋 ${bold(
        cyan(`Welcome back ${underline(cyan(`${`John Doe`}`))}`),
      )}, you are now logged in!`,
    );
  }
}

const triggerCancel = () => {
  cancel("Opeartion cancelled");
  process.exit(0);
};

const handleKeyChain = async (email: string) => {
  const publicKey = await keytar.getPassword("envless-cli", "publicKey");
  const privateKey = await keytar.getPassword("envless-cli", "privateKey");
  const jwtToken = await keytar.getPassword("envless-cli", "jwtToken");

  if (!publicKey || !privateKey) {
    const pgp = await OpenPGP.generageKeyPair("CLI", email);
    await keytar.setPassword("envless-cli", "publicKey", pgp.publicKey);
    await keytar.setPassword("envless-cli", "privateKey", pgp.privateKey);
  }
};
