import { Command, ux } from "@oclif/core";
import axios from "axios";

const gradient = require("gradient-string");
const BASE_URL = `https://envless.dev`;
const ENDPOINT = `${BASE_URL}/api/cli/signup`;

const validateEmail = async (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export default class Init extends Command {
  static description = "Signup for early access to Envless";

  static examples = [
    `$ oex init --from oclif
init from oclif! (./src/commands/init/index.ts)
`,
  ];

  async run(): Promise<void> {
    console.log(
      gradient(
        "#ccfbf1",
        "#5eead4",
        "#06b6d4",
      )(`
👋 Welcome to Envless CLI!


                           888
                           888
                           888
 .d88b.  88888b.  888  888 888  .d88b.  .d8888b  .d8888b
d8P  Y8b 888 "88b 888  888 888 d8P  Y8b 88K      88K
88888888 888  888 Y88  88P 888 88888888 "Y8888b. "Y8888b.
Y8b.     888  888  Y8bd8P  888 Y8b.          X88      X88
 "Y8888  888  888   Y88P   888  "Y8888   88888P'  88888P'



      `),
    );

    this.log(
      "Join the growing community of developers who are building with Envless",
    );
    const email = (await ux.prompt("What is your email?")) as string;
    const isValid = await validateEmail(email);

    if (!isValid) {
      this.log("Please enter a valid email address");
      this.log(`
        If you dont want to deal with that shit, Let's just chat:
        📅 https://cal.com/dahal
      `);
      return;
    }

    const source = "CLI";
    const name = await ux.prompt("What is your name?");
    const others = await ux.prompt(
      "Are you using any secrets management tools?",
    );

    const body = JSON.stringify({
      email,
      name,
      source,
      others,
    }) as any;

    const signup = (await axios.post(ENDPOINT, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })) as any;

    if (signup.status === 200) {
      this.log(
        gradient(
          "#ccfbf1",
          "#5eead4",
          "#06b6d4",
        )(
          `


          🎉 Thanks for signing up! I would love to get to know you pesonally. Lets chat!
            📅 https://cal.com/dahal

          We are building Envless in public. Please ⭐ on GitHub and follow us on Twitter to stay up to date.
            ⭐ https://github.com/envless/envless
            💖 https://twitter.com/envless


        `,
        ),
      );

      return;
    } else {
      this.log(`
        Something went wrong. Fuck it, lets just chat:

        📅 https://cal.com/dahal
      `);
      return;
    }
  }
}
