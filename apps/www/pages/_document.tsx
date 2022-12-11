import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      className="no-scrollbar bg-darkest text-lightest min-h-screen"
      lang="en"
    >
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
