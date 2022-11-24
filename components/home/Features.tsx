import Link from 'next/link';
import { BsShieldFillCheck, BsTerminalFill } from 'react-icons/bs'
import { BiGitBranch } from 'react-icons/bi'
import { TbConfetti } from 'react-icons/tb'
import { RiOpenSourceFill, RiSunCloudyFill } from 'react-icons/ri'

const Features = () => {
  return (
    <div className="mx-auto mt-24 md:px-24">
      <div className="text-center">
        <h2 className="text-3xl font-normal text-gray-300 font-heading sm:text-4xl">
          By developers, for developers
        </h2>
        <p className="max-w-md mx-auto mt-2 text-gray-400">
          Buit for speed, security and productivity.
        </p>
      </div>
      <div className="grid mt-10 gap-x-48 gap-y-12 md:grid-cols-2">
        <div className="flex items-start gap-4">
          <span className="p-3 text-teal-400 rounded-full bg-violet-500/10">
            <BsShieldFillCheck className="w-6 h-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">End to end encryption</h3>
            <p className="mt-1 text-gray-400">
              With E2E encyption and role based read/write access you can rest assured that your secrets are safe with us.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="p-3 text-teal-400 rounded-full bg-violet-500/10">
            <BiGitBranch className="w-6 h-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Version control</h3>
            <p className="mt-1 text-gray-400">
              Developers work on multiple branches. Now you can create as many branches as you like for env variables. It works just like git.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="p-3 text-teal-400 rounded-full bg-violet-500/10">
            <TbConfetti className="w-6 h-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Boost productivity</h3>
            <p className="mt-1 text-gray-400">
              Built by developer, for developers. Build with speed in mind. With API and database hosted on edge networks, you can globally sync app secrets across teams.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="p-3 text-teal-400 rounded-full bg-violet-500/10">
            <BsTerminalFill className="w-6 h-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Complete CLI support</h3>
            <p className="mt-1 text-gray-400">
              Without leaving your terminal, you can create projects, invite team, add, update or remove env variables, create branches and much more.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="p-3 text-teal-400 rounded-full bg-violet-500/10">
            <RiOpenSourceFill className="w-6 h-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Proudly OpenSource</h3>
            <p className="mt-1 text-gray-400">
              Check us out on <Link href="https://github.com/envless/envless" target="_blank" className="text-teal-400">Github</Link>. We are always open to contributions. If you have any ideas or suggestions, feel free to open an issue.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="p-3 text-teal-400 rounded-full bg-violet-500/10">
            <RiSunCloudyFill className="w-6 h-6" />
          </span>
          <div>
            <h3 className="text-xl font-semibold">Works everywhere</h3>
            <p className="mt-1 text-gray-400">
              Envless works with any programming language, framework or platform. Develop your app locally, deploy to cloud and sync env variables with Envless.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
