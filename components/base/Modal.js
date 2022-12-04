import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Logo from "@/components/base/Logo";
import { IoCloseSharp } from "react-icons/io5";

export default function Modal({ ...props }) {
  const { Button, title, children } = props;
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div onClick={openModal}>
        <Button />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-dark p-6 text-left align-middle shadow-xl shadow-black ring-1 ring-[#222] transition-all">
                  <div className="absolute top-0 right-0 p-3">
                    <button
                      type="button"
                      className="text-light hover:text-gray-200"
                      onClick={closeModal}
                    >
                      <span className="sr-only">Close</span>
                      <IoCloseSharp className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mb-3 flex items-center justify-center">
                    <Logo />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="border-b border-[#222] pb-6 text-center text-2xl font-medium leading-6"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm">{children}</p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
