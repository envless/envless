import Link from "next/link";
import { useState } from "react";
import { IoCopy, IoCheckmarkCircle, IoLogoGithub } from "react-icons/io5";

type HeroProps = {
  header: string;
};

const Hero: React.FC<HeroProps> = ({ header }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("npx envless init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="flex">
      <div className="h-min bg-[url('/world.png')] bg-contain bg-center bg-no-repeat">
        <div className="relative px-2 py-16 text-center lg:px-48 xl:py-32">
          <div className="mb-3">
            <Link
              href="https://github.com/envless/envless"
              target="_blank"
              rel="noreferrer"
              className="mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full bg-lightest/20 px-5 py-2 transition-all hover:bg-lightest/30"
            >
              <IoLogoGithub className="inline-block h-4 w-4 text-gray-300" />
              <p className="text-sm">Star on GitHub</p>
            </Link>
          </div>
          <h1 className="font-display inline bg-gradient-to-r from-teal-100 via-teal-300 to-cyan-500 bg-clip-text text-5xl tracking-tight text-transparent md:text-8xl">
            {header}
          </h1>

          <h2 className="mt-3 text-lg text-lighter md:text-2xl">
            An open-source, the most secure and frictionless way to share and
            manage app secrets across teams.
          </h2>

          <div className="mt-5 flex flex-col justify-center gap-3 md:flex-row">
            <span
              className="flex cursor-copy items-center justify-between gap-5 rounded-full bg-dark px-5 py-3"
              onClick={copyToClipboard}
            >
              <code className="overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-300">
                npx envless init
              </code>{" "}
              {copied ? (
                <IoCheckmarkCircle className="h-4 w-4 text-teal-400" />
              ) : (
                <IoCopy className="h-4 w-4 text-gray-300" />
              )}
            </span>

            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-6 py-3 text-darkest hover:bg-teal-200"
              href="/docs"
              target="_self"
            >
              <span>Documentation</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
