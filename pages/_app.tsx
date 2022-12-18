import "@/styles/globals.css";
import "@/styles/zoom.css";
import type { AppProps } from "next/app";
// import { Manrope } from "@next/font/google";
// const font = Manrope({ subsets: ["latin"] });
import { Lexend_Deca } from "@next/font/google";
const font = Lexend_Deca({ subsets: ["latin"], weight: ["300"] });

import { Analytics } from "@vercel/analytics/react";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}
