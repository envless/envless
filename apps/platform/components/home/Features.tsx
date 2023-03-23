import Link from "next/link";
import {
  Cloudy,
  GitBranchPlus,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";
import { ConfettiIcon, OpenSourceIcon } from "@/components/icons";

const Features = () => {
  return (
    <div className="mx-auto mt-24 md:px-24">
      <div className="text-center">
        <h2 className="heading text-3xl text-gray-300 sm:text-4xl">
          By developers, for developers
        </h2>
        <p className="text-light mx-auto mt-2 max-w-md">
          Built for security, speed, collaboration and productivity.
        </p>
      </div>
      <div className="mt-10 grid gap-x-48 gap-y-12 md:grid-cols-2">
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl">End to end encryption</h3>
            <p className="text-light mt-1">
              With E2E encyption and role based read/write access you can rest
              assured that your secrets are safe with us.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <GitBranchPlus className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl">Version control</h3>
            <p className="text-light mt-1">
              Developers work on multiple branches. Now you can create as many
              branches as you like for env variables. It works just like git.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <ConfettiIcon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl">Boost productivity</h3>
            <p className="text-light mt-1">
              Built by developers, for developers. Built with speed in mind.
              With API and database hosted on edge networks, you can globally
              sync app secrets across teams.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <TerminalSquare className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl">Complete CLI support</h3>
            <p className="text-light mt-1">
              Without leaving your terminal, you can create projects, invite
              team, add, update or remove env variables, create branches and
              much more.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <OpenSourceIcon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl">Proudly open source</h3>
            <p className="text-light mt-1">
              Check us out on{" "}
              <Link
                href="https://github.com/envless/envless"
                target="_self"
                className="text-teal-400"
              >
                Github
              </Link>
              . We are always open to contributions. If you have any ideas or
              suggestions, feel free to open an issue.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <Cloudy className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl">Works everywhere</h3>
            <p className="text-light mt-1">
              Envless works with any programming language, framework or
              platform. Develop your app locally, deploy to cloud and sync env
              variables with Envless.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
