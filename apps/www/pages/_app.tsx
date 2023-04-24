import type { AppType } from "next/app";
import { Inter } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import NextNProgress from "nextjs-progressbar";
import "ui/styles/tailwind.css";
import ErrorBoundary from "@/components/errorboundary";
import Fallback from "@/components/errorboundary/Fallback";
import "@/styles/primary.css";
import "ui/styles/zoom.css";

const inter = Inter({ subsets: ["latin"] });

const Envless: AppType = ({ Component, pageProps }) => {
  return (
    <main className={inter.className}>
      <NextNProgress
        color="#5eead4"
        startPosition={0.3}
        stopDelayMs={200}
        height={1.5}
        showOnShallow={true}
      />
      <ErrorBoundary fallback={<Fallback />}>
        <Component {...pageProps} />
      </ErrorBoundary>
      <Analytics />
    </main>
  );
};

export default Envless;
