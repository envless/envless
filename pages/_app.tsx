import "../styles/font.css";
import type { AppProps } from "next/app";
import { Lexend_Deca } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
const font = Lexend_Deca({ subsets: ["latin"], weight: "400" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}
