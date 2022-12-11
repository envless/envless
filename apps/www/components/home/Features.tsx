import Link from "next/link";
import { BsShieldFillCheck, BsTerminalFill } from "react-icons/bs";
import { BiGitBranch } from "react-icons/bi";
import { TbConfetti } from "react-icons/tb";
import { RiOpenSourceFill, RiSunCloudyFill } from "react-icons/ri";

const Features = () => {
  return (
    <div className="mx-auto mt-24 md:px-24">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-normal text-gray-300 sm:text-4xl">
          By developers, for developers
        </h2>
        <p className="text-light mx-auto mt-2 max-w-md">
          Buit for security, speed, collaboration and productivity.
        </p>
      </div>
      <div className="mt-10 grid gap-x-48 gap-y-12 md:grid-cols-2">
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <BsShieldFillCheck className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">End to end encryption</h3>
            <p className="text-light mt-1">
              With E2E encyption and role based read/write access you can rest
              assured that your secrets are safe with us.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <BiGitBranch className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Version control</h3>
            <p className="text-light mt-1">
              Developers work on multiple branches. Now you can create as many
              branches as you like for env variables. It works just like git.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <TbConfetti className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Boost productivity</h3>
            <p className="text-light mt-1">
              Built by developer, for developers. Build with speed in mind. With
              API and database hosted on edge networks, you can globally sync
              app secrets across teams.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <BsTerminalFill className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Complete CLI support</h3>
            <p className="text-light mt-1">
              Without leaving your terminal, you can create projects, invite
              team, add, update or remove env variables, create branches and
              much more.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="rounded-full bg-teal-400/20 p-3 text-teal-400">
            <RiOpenSourceFill className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Proudly OpenSource</h3>
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
            <RiSunCloudyFill className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Works everywhere</h3>
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
