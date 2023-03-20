import type { AppType } from "next/app";
import { trpc } from "@/utils/trpc";
import { Inter } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import ErrorBoundary from "@/components/errorboundary";
import Fallback from "@/components/errorboundary/Fallback";
import "@/styles/balloon.css";
import "@/styles/globals.css";
import "@/styles/primary.css";
import "@/styles/zoom.css";

const inter = Inter({ subsets: ["latin"] });

const Envless: AppType = ({ Component, pageProps }) => {
  return (
    // @ts-ignore
    <SessionProvider session={pageProps.session}>
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
    </SessionProvider>
  );
};

export default trpc.withTRPC(Envless);
