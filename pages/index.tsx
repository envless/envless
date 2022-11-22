import Link from "next/link";
import { sample } from "lodash";
import { getSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
// import Screenshot from "@/components/home/Screenshot"
import Highlights from "@/components/home/Highlights"
import Features from "@/components/home/Features"
import Pricing from "@/components/home/Pricing"

export default function Home({ loggedIn, header }) {
  return (
    <main className="max-w-screen-xl px-10 mx-auto xl:px-16">
      <Navigation loggedIn={loggedIn} />

      {/* Hero section */}
      <section className="flex">
        <div className="bg-no-repeat bg-center bg-contain bg-[url('/world.png')] h-min">
          <div className="relative px-2 py-24 text-center xl:py-48">
            <h1 className="inline text-5xl font-semibold tracking-tight text-transparent md:text-8xl bg-gradient-to-r via-green-300 from-teal-400 to-cyan-500 bg-clip-text font-display">
              {header}
            </h1>
            <h2 className="mt-3 text-xl tracking-tight text-gray-300 md:text-3xl text-light">
              An open-source, frictionless and secure way to share and manage
              app secrets across teams.
            </h2>
            <div className="flex justify-center gap-6 mt-8">
              <Link
                className="px-6 py-3 font-semibold rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-900 hover:bg-teal-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500"
                href="/auth"
              >
                SIGN UP FOR FREE
                <svg
                  className="inline w-5 h-5 mb-1 ml-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <Highlights /> */}
      <Features />
      <Pricing />
    </main>
  );
}

Home.getInitialProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  const user = session?.user;
  const headers = [
    "Go .envless",
    "Delete your .env",
    "e2e encrypt your .env",
    "Sync your app secrets",
    "Branch your app secrets",
    "Secure your app secrets",
    "Manage & share app secrets",
    "Never leak .env again",
    "Never slack .env again",
    "e2e encrypt app secrets",
    "Never commit .env again",
  ];

  const header = sample(headers);

  return {
    header,
    loggedIn: !!user,
  };
};
