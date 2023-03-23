import "../styles/font.css";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
const font = Inter({ subsets: ["latin"], weight: "400" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}
