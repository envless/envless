import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="no-scrollbar min-h-screen bg-black text-white" lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
