import Link from "next/link";
import { Fragment, useState } from "react";
import type { Project } from "@prisma/client";
import Code from "@/components/theme/Code";
import CodeWithTabs from "@/components/theme/CodeWithTabs";

interface CliProps {
  cliToken?: string;
  currentProject: Project;
}

const CliSetup = ({ cliToken, currentProject }: CliProps) => {
  return (
    <Fragment>
      <div className="px-4">
        <section className="mb-20">
          <h3 className="text-lg">
            <span className="text-darker mr-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300">
              1
            </span>
            Install envless CLI
          </h3>
          <p className="text-light mt-2 text-sm">
            You may skip this step if you already have the CLI installed.
          </p>

          <CodeWithTabs
            tabs={[
              {
                label: "NPM",
                lang: "shell",
                snippet: `npm i -g envless`,
              },
              {
                label: "Yarn",
                lang: "shell",
                snippet: `yarn global add envless`,
              },

              {
                label: "Homebrew",
                lang: "shell",
                snippet: `brew install envless`,
              },
            ]}
          />

          <p className="text-light text-xs">
            For other OS installation guidelines, please refer to our{" "}
            <Link
              href="https://envless.dev/docs/cli"
              target={"_blank"}
              className="text-teal-400"
            >
              documentation.
            </Link>
          </p>
        </section>

        <section className="mb-20">
          <h3 className="text-lg">
            <span className="text-darker mr-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300">
              2
            </span>
            Initialize envless CLI
          </h3>
          <p className="text-light mt-2 text-sm">
            From your project's root directory, run the following command to
            activate the CLI.{" "}
            <Code
              copy={true}
              language={"shell"}
              code={`envless init \\ \n --pid ${currentProject.id} \\\n --token ${cliToken}`}
            />
          </p>
          <p className="text-light text-xs">
            Learn more about{" "}
            <Link
              href="https://envless.dev/docs/cli"
              target={"_blank"}
              className="text-teal-400"
            >
              Envless CLI
            </Link>
          </p>
        </section>

        <section className="mb-20">
          <h3 className="text-lg">
            <span className="text-darker mr-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300">
              3
            </span>
            You are all set !
          </h3>
          <p className="text-light mt-2 text-sm">
            If you didnot see any errors, you are good to go. Your private key
            is now securely stored in your local machine. It is also currently
            copied to your clipboard. Please click the button below to continue.
            You will be asked to paste the private key in the next step.
          </p>
        </section>
      </div>
    </Fragment>
  );
};

export default CliSetup;
