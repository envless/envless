import Link from "next/link";
import { useState } from "react";
import { IoCopy, IoCheckmarkCircle } from "react-icons/io5";

type HeroProps = {
  header: string;
};

const Hero: React.FC<HeroProps> = ({ header }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("npm i -g envless");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="flex">
      <div className="bg-no-repeat bg-center bg-contain bg-[url('/world.png')] h-min">
        <div className="relative px-2 py-16 text-center xl:py-32 lg:px-48">
          <h1 className="inline text-5xl font-semibold tracking-tight text-transparent md:text-8xl bg-gradient-to-r via-green-300 from-teal-400 to-cyan-500 bg-clip-text font-display">
            {header}
          </h1>
          <h2 className="mt-3 text-lg text-gray-300 md:text-2xl">
            An open-source, the most secure and frictionless way to share and manage
            app secrets across teams.
          </h2>

          <div className="flex flex-col justify-center gap-3 mt-5 md:flex-row">
            <span className="cursor-copy flex items-center justify-between gap-5 px-5 py-3 bg-[#222] rounded-full" onClick={ copyToClipboard }>
              <code className="overflow-hidden text-gray-300 whitespace-nowrap overflow-ellipsis">
                npm i -g envless
              </code>{" "}

              { copied ? (
                <IoCheckmarkCircle className="w-4 h-4 text-teal-400" />
              ) : (
                <IoCopy className="w-4 h-4 text-gray-300" />
              )}
            </span>

            <Link
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-white rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-900 hover:bg-teal-200"
              href="/auth"
            >
              <span>Documentation</span><span className="text-xs">{" (soon) "}</span>
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
  )
};

export default Hero;