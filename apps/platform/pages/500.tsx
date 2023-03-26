import Link from "next/link";
import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { ArrowLeft } from "lucide-react";
import { NextSeo } from "next-seo";

export default function Custom500() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <>
      <NextSeo
        title="Envless - Server Error"
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
            500
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
            Oops! Server Error
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
              className="text-darkest my-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-6 py-3 hover:bg-teal-200 md:my-10"
              href="/"
              target="_self"
            >
              <ArrowLeft className="h-6 w-6" />
              <span>Back to Homepage</span>
            </Link>
          </Transition.Child>
        </Transition.Root>
      </div>
    </>
  );
}
