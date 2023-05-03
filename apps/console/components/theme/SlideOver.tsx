import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { X } from "lucide-react";

export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface SlideOverProps {
  title: string;
  description: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
  size?: Size;
  children: React.ReactNode;
  closable?: boolean;
  footer?: React.ReactNode;
}

const SlideOver = ({
  open,
  setOpen,
  onClose,
  size,
  title,
  description,
  children,
  closable = true,
  footer,
}: SlideOverProps) => {
  const sizeVariant = size ?? "sm";

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          closable && onClose();
        }}
      >
        <div className="backdrop-blur-xs fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className={clsx(
                    "pointer-events-auto w-screen",
                    sizeVariant === "xs" && "max-w-xs",
                    sizeVariant === "sm" && "max-w-sm",
                    sizeVariant === "md" && "max-w-md",
                    sizeVariant === "lg" && "max-w-lg",
                    sizeVariant === "xl" && "max-w-xl",
                    sizeVariant === "2xl" && "max-w-2xl",
                  )}
                >
                  <div className="divide-dark bg-darker flex h-full flex-col divide-y-2 shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col">
                      <div className="bg-darkest/50 px-4 py-8 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lighter text-base font-semibold leading-6">
                            {title}
                          </Dialog.Title>

                          {closable && (
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="rounded-md focus:outline-none"
                                onClick={onClose}
                              >
                                <span className="sr-only">Close panel</span>
                                <X
                                  className="text-lightest h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="mt-1">
                          <p className="text-light text-sm">{description}</p>
                        </div>
                      </div>
                      <div className="scrollbar relative mt-6 flex-1 overflow-auto px-4 sm:px-6">
                        {children}
                      </div>
                    </div>

                    {footer}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SlideOver;
