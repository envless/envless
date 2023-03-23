import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";

const Fallback = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
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
          Oops!
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
          Client side exception
        </Transition.Child>

        <Transition.Child
          className="flex gap-6"
          enter="transition-all ease-in-out duration-500 delay-[600ms]"
          enterFrom="opacity-0 translate-y-6"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="text-darkest my-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-6 py-3 hover:bg-teal-200 md:my-10"
            onClick={() => router.reload()}
          >
            <span>Reload this Page</span>
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke-linecap="square"
                stroke-miterlimit="10"
                stroke-width="32"
                d="M400 148l-21.12-24.57A191.43 191.43 0 00240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 00181.07-128"
              ></path>
              <path d="M464 68.45V220a4 4 0 01-4 4H308.45a4 4 0 01-2.83-6.83L457.17 65.62a4 4 0 016.83 2.83z"></path>
            </svg>
          </div>
          <div
            className="text-darkest my-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-6 py-3 hover:bg-teal-200 md:my-10"
            onClick={() => {
              router.push("/").then(() => router.reload());
            }}
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
          </div>
        </Transition.Child>
      </Transition.Root>
    </div>
  );
};

export default Fallback;
