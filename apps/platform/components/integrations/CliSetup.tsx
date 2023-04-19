import Link from "next/link";
import { Fragment, useState } from "react";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { trpc } from "@/utils/trpc";
import type { Project } from "@prisma/client";
import * as argon2 from "argon2-browser";
import { randomBytes } from "crypto";
import { Button } from "@/components/theme";
import CodeWithTabs from "@/components/theme/CodeWithTabs";

interface CliProps {
  currentProject: Project;
}

const CliSetup = ({ currentProject }: CliProps) => {
  const { cli: cliQuery } = trpc.useContext();

  const [cli, setCli] = useState<{
    id: string;
    token: string;
  }>({ id: "", token: "" });

  useUpdateEffect(() => {
    const fetchCliSetup = async () => {
      if (!cli.id || !cli.token) {
        const { cli: record } = await cliQuery.getOne.fetch();
        if (record) {
          setCli({ ...cli, id: record.id });
        }
      }
    };

    fetchCliSetup().catch(console.error);
  }, []);

  const { mutate: createCliTokenMutation, isLoading: loadingCreate } =
    trpc.cli.create.useMutation({
      onSuccess: (response) => {
        const { cli: record } = response;
        setCli({ ...cli, id: record.id });
      },

      onError: (error) => {
        console.log(error);
      },
    });

  const { mutate: updateCliTokenMutation, isLoading: loadingUpdate } =
    trpc.cli.update.useMutation({
      onSuccess: (_response) => {
        console.log("Update successful");
      },

      onError: (error) => {
        console.log(error);
      },
    });

  const createOrUpdateCLiToken = async () => {
    const token = randomBytes(32).toString("hex");
    const salt = randomBytes(32).toString("hex");

    const { encoded: hashedToken } = (await argon2.hash({
      pass: token,
      salt,
    })) as { encoded: string };

    if (cli.id) {
      const confirm = window.confirm(
        "Are you sure you want to rotate your CLI token? All previous CLI access will be revoked. This action cannot be undone.",
      );
      if (confirm) {
        setCli({ ...cli, token });
        await updateCliTokenMutation({ hashedToken });
      }
    } else {
      setCli({ ...cli, token });
      await createCliTokenMutation({ hashedToken });
    }
  };

  return (
    <Fragment>
      <div className="px-4">
        <section className="mb-14">
          <h3 className="text-lg">
            <span className="text-darker mr-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300">
              1
            </span>
            Installation
          </h3>
          <div className="text-light mt-2 text-sm">
            You may skip this step if you already have the Envless CLI
            installed.
          </div>

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
            For other OS installation and other CLI guidelines, please refer to
            our{" "}
            <Link
              href="https://envless.dev/docs/cli"
              target={"_blank"}
              className="text-teal-400"
            >
              documentation.
            </Link>
          </p>
        </section>

        <section className="mb-14">
          <h3 className="text-lg">
            <span className="text-darker mr-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300">
              2
            </span>
            Initialize CLI
          </h3>
          <div className="text-light mt-2 text-sm">
            You may skip this step if you have already Initialized the Envless
            CLI.
            {cli && cli.id && cli.token ? (
              <CodeWithTabs
                tabs={[
                  {
                    label: "Terminal",
                    lang: "shell",
                    snippet: `envless init \\\n --id ${cli.id} \\\n --token ${cli.token}`,
                  },
                  {
                    label: "Help",
                    lang: "shell",
                    snippet: `envless init --help`,
                  },
                ]}
              />
            ) : (
              <Button
                size="sm"
                variant={cli.id ? "danger-outline" : "secondary"}
                className="mt-3"
                loading={loadingCreate || loadingUpdate}
                onClick={async () => {
                  await createOrUpdateCLiToken();
                }}
              >
                {cli.id ? "Rotate " : "Generate "}
                CLI token
              </Button>
            )}
          </div>
        </section>

        <section className="mb-14">
          <h3 className="text-lg">
            <span className="text-darker mr-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300">
              3
            </span>
            Link project
          </h3>
          <div className="text-light mt-2 text-sm">
            From your {`project's`} root directory, run the following command to
            activate the CLI.
            <CodeWithTabs
              tabs={[
                {
                  label: "Terminal",
                  lang: "shell",
                  snippet: `envless project link \\\n --projectId ${currentProject.id}`,
                },
                {
                  label: "Help",
                  lang: "shell",
                  snippet: `envless project link --help`,
                },
              ]}
            />
          </div>
          <p className="text-light text-xs">
            You may skip this step if you have already already have .envless
            file on your {`project's`} root and is already linked.
          </p>
        </section>

        <section className="mb-14">
          <h3 className="text-lg">
            <span className="text-darker mr-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300">
              4
            </span>
            Secure and copy your private key
          </h3>
          <div className="text-light mt-2 text-sm">
            Please run the following command to secure and copy your private
            key. This will securely store your private key in your {`system's`}
            keychain and copy it to your clipboard. You will be asked to paste
            the private key in the next step.
            <CodeWithTabs
              tabs={[
                {
                  label: "Terminal",
                  lang: "shell",
                  snippet: `envless privateKey --secure --copy`,
                },
                {
                  label: "Help",
                  lang: "shell",
                  snippet: `envless privateKey --help`,
                },
              ]}
            />
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default CliSetup;
