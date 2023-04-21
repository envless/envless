import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../styles/code.css";
import "../styles/font.css";

const font = Inter({ subsets: ["latin"], weight: "400" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}
