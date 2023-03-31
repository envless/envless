import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { env } from "@/env/index.mjs";
import { Transition } from "@headlessui/react";
import { Button, Hr } from "@/components/theme";
import BaseModal from "@/components/theme/BaseModal";
import TwoFactorForm from "@/components/twoFactorForm";
import log from "@/lib/log";

const TwoFactorAuth = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const router = useRouter();

  return (
    <Fragment>
      <Transition appear show={!modalVisible} as={Fragment}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Head>
            <title>Two-factor authentication</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <div className="flex h-screen flex-col justify-center px-12">
            <div className="bg-darker rounded p-10 sm:mx-auto sm:w-full sm:max-w-md">
              <Image
                className="mx-auto h-12 w-auto"
                height={100}
                width={100}
                src="/logo.png"
                alt="Your Company"
              />
              <h2 className="mt-6 text-center text-2xl">
                Two-factor authentication
              </h2>
              <p className="text-light mt-2 text-center text-sm">
                Two factor authentication is required to continue. Please enter
                the code from your authenticator app.
              </p>

              <Hr className="my-8" />

              <TwoFactorForm
                onConfirm={() => {
                  log("2fa confirmed on the page, redirecting...");
                  router.push("/projects");
                }}
              />
            </div>
          </div>
        </Transition.Child>
      </Transition>
      <BaseModal
        title="Verification Attempt Limit"
        isOpen={modalVisible}
        setIsOpen={setModalVisible}
      >
        <p className="text-light mt-2 text-center text-base leading-5">
          Please note that you have a limited number of attempts to verify your
          account. This number is set to{" "}
          <b className="text-bold text-lighter">
            {env.NEXT_PUBLIC_MAX_AUTH_ATTEMPTS}
          </b>
          , so please make sure to enter the correct information during each
          attempt.
        </p>
        <Button
          className="mx-auto mt-5 w-2/3"
          onClick={() => setModalVisible(false)}
        >
          Got it
        </Button>
      </BaseModal>
    </Fragment>
  );
};

export default TwoFactorAuth;
