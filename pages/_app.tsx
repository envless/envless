import type { AppType } from "next/app";
import { trpc } from "@/utils/trpc";
import { Inter } from "@next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import SnackbarProvider from "react-simple-snackbar";
import "@/styles/globals.css";
import "@/styles/zoom.css";

const inter = Inter({ subsets: ["latin"] });

const Envless: AppType = ({ Component, pageProps }) => {
  return (
    // @ts-ignore
    <SessionProvider session={pageProps.session}>
      <main className={inter.className}>
        <SnackbarProvider>
          <Component {...pageProps} />
        </SnackbarProvider>
        <Analytics />
      </main>
    </SessionProvider>
  );
};

export default trpc.withTRPC(Envless);
