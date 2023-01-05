import "@/styles/globals.css";
import "@/styles/zoom.css";
import { trpc } from "@/utils/trpc";
import type { AppType } from "next/app";
import { Inter } from "@next/font/google";
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });

import { Analytics } from "@vercel/analytics/react";

const Envless: AppType = ({ Component, pageProps }) => {
  return (
    // @ts-ignore
    <SessionProvider session={pageProps.session}>
      <main className={inter.className}>
        <Component {...pageProps} />
        <Analytics />
      </main>
    </SessionProvider>
  );
};

export default trpc.withTRPC(Envless);
