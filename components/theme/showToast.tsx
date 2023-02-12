import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  title: string;
  subtitle: string;
  open: boolean;
  type: "warning" | "success" | "error";
  id: string;
};

export default function Toast({
  type = "success",
  title,
  subtitle,
  open,
  id,
}: Props) {
  function renderToastIcon(type) {
    switch (type) {
      case "success":
        return (
          <CheckCircleIcon
            className="h-6 w-6 text-teal-300"
            aria-hidden="true"
          />
        );

      case "warning":
        return (
          <AlertCircleIcon
            className="h-6 w-6 text-yellow-500"
            aria-hidden="true"
          />
        );

      case "error":
        return (
          <XCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
        );
    }
  }

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-4 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={open}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto z-50 w-full max-w-sm overflow-hidden rounded bg-dark shadow-lg">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">{renderToastIcon(type)}</div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-lightest">{title}</p>
                  <p className="mt-1 text-sm text-light">{subtitle}</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    className="inline-flex rounded border border-transparent px-2 py-0.5 text-lighter focus:outline-none focus:ring-1 focus:ring-teal-300 focus:ring-offset-1  hover:bg-darkest"
                    onClick={() => toast.dismiss(id)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}

export function showToast({ title, subtitle, duration = 1500, type }) {
  toast.custom(
    (t) => (
      <Toast
        title={title}
        subtitle={subtitle}
        open={t.visible}
        type={type}
        id={t.id}
      />
    ),
    { duration },
  );
}
