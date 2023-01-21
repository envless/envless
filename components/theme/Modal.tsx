import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Logo } from "@/components/theme";

/**
 * Props for the Modal component.
 * @typedef {Object} Props
 * @property {string} title - The title of the modal.
 * @property {React.ReactNode} button - The button that will trigger the modal.
 * @property {React.ReactNode} children - The content of the modal.
 */
type Props = {
  title: string;
  subtitle?: string;
  button: React.ReactNode;
  children: React.ReactNode;
};

/**
 * A modal component.
 * @param {Props} props - The props for the component.
 */
const Modal = (props: Props) => {
  const { button, title, subtitle, children } = props;
  let [open, setOpen] = useState(false);

  /**
   * Closes the modal.
   */
  function closeModal() {
    setOpen(false);
  }

  /**
   * Opens the modal.
   */
  function openModal() {
    setOpen(true);
  }

  return (
    <>
      <div onClick={openModal}>{button}</div>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-darkest bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto backdrop-blur">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-darker p-8 text-left align-middle shadow-xl shadow-black ring-1 ring-[#222] transition-all">
                  <div className="absolute top-0 right-0 p-3">
                    <button
                      type="button"
                      className="text-light hover:text-gray-200"
                      onClick={closeModal}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mb-3 flex items-center justify-center">
                    <Logo />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="pb-6 text-center text-2xl font-normal leading-6"
                  >
                    {title}
                  </Dialog.Title>
                  {subtitle && (
                    <Dialog.Title
                      as="h5"
                      className="pb-6 text-center text-sm leading-5 text-light"
                    >
                      {subtitle}
                    </Dialog.Title>
                  )}

                  <Hr />

                  <div className="mt-4">{children}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
