import Link from "next/link";
import { sample } from "lodash";
import { getSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import Features from "@/components/home/Features";
export default function Home({ loggedIn, header }) {
  return (
    <main className="max-w-screen-xl px-10 py-6 mx-auto">
      <Navigation loggedIn={loggedIn} />

      {/* Hero section */}
      <section className="bg-no-repeat bg-center bg-cover bg-[url('/world.png')] h-[500px]">
        <div className="relative px-2 py-32 text-center">
          <p className="inline text-6xl font-semibold tracking-tight text-transparent md:text-8xl bg-gradient-to-r via-green-300 from-teal-400 to-cyan-500 bg-clip-text font-display">
            {header}
          </p>
          <p className="mt-3 text-xl tracking-tight text-gray-200 md:text-3xl">
            An open-source, frictionless and secure way to share and manage app
            secrets across teams.
          </p>
          <div className="flex justify-center gap-6 mt-8">
            {/* <button className="px-6 font-mono font-medium text-white rounded-full md:py-2 bg-slate-800 hover:bg-slate-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400" onClick={ () => { alert('Copied') } }>
              npm i -g envless
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline w-5 h-5 ml-4"
              >
                <path
                  fillRule="evenodd"
                  d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <Link
              className="px-6 py-2 font-semibold bg-teal-200 rounded-full text-slate-900 hover:bg-teal-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500"
              href="/"
            >
              Documentation
            </Link> */}
            <Link
              className="px-6 py-2 font-semibold bg-teal-200 rounded-full text-slate-900 hover:bg-teal-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500"
              href="/"
            >
              SIGN UP FOR FREE
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      {/* <Features /> */}
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
    "Never leak your .env again",
    "Never slack your .env again",
    "e2e encrypt your app secrets",
    "Never commit your .env again",
  ];

  const header = sample(headers);

  return {
    header,
    loggedIn: !!user,
  };
};
