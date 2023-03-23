import Link from "next/link";
import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { NextSeo } from "next-seo";

export default function Custom404() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <>
      <NextSeo
        title="Envless - Not found"
        description="Open source, frictionless and secure way to share and manage app secrets across teams."
        canonical="https://envless.dev"
        themeColor="#111"
        openGraph={{
          url: "https://envless.dev",
          title: "Envless - Secure and sync your secrets",
          description:
            "Open source, frictionless and secure way to share and manage app secrets across teams.",
          images: [{ url: "https://envless.dev/og.png" }],
          siteName: "Envless",
        }}
        twitter={{
          handle: "@envless",
          site: "@envless",
          cardType: "summary_large_image",
        }}
      />
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Transition.Root className="text-center" show={show}>
          <Transition.Child
            className="inline shrink-0 bg-gradient-to-r from-teal-100 via-teal-300 to-cyan-500 bg-clip-text font-bold tracking-tight text-transparent md:text-9xl"
            as="h1"
            enter="transition-all ease-in-out duration-500 delay-[200ms]"
            enterFrom="opacity-0 translate-y-6"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            404
          </Transition.Child>

          <Transition.Child
            className="text-center text-4xl leading-normal"
            as="p"
            enter="transition-all ease-in-out duration-500 delay-[400ms]"
            enterFrom="opacity-0 translate-y-6"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            Oops! Page not found
          </Transition.Child>

          <Transition.Child
            enter="transition-all ease-in-out duration-500 delay-[600ms]"
            enterFrom="opacity-0 translate-y-6"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Link
              className="my-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-6 py-3 text-darkest hover:bg-teal-200 md:my-10"
              href="/"
              target="_self"
            >
              <span>Back to Homepage</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          </Transition.Child>
        </Transition.Root>
      </div>
    </>
  );
}
