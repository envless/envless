import "@/styles/globals.css";
import "@/styles/zoom.css";
import { trpc } from "@/utils/trpc";
import type { AppType } from "next/app";
import { Lexend_Deca } from "@next/font/google";
const font = Lexend_Deca({ subsets: ["latin"], weight: ["300"] });

import { Analytics } from "@vercel/analytics/react";

const Envless: AppType = ({ Component, pageProps }) => {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
};

export default trpc.withTRPC(Envless);
