import React, { Fragment, useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { Dialog, Transition } from "@headlessui/react";
import AuthCode from "react-auth-code-input";
import { IoCloseSharp } from "react-icons/io5";
import { Button, Logo, Paragraph } from "@/components/theme";

/**
 * Props for the Modal component.
 * @property {Boolean} open - Whether the modal is open or not.
 * @property {Function} onConfirm - The function to run when the modal is confirmed.
 */

interface Props {
  open: boolean;
  onConfirm: () => void;
  onStateChange: (state: boolean) => void;
}

/**
 * A modal component.
 * @param {Props} props - The props for the component.
 */
const TwoFactorModal = (props: Props) => {
  const [open, setOpen] = useState(props.open);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  /**
   * Closes the modal.
   */
  function closeModal() {
    setOpen(false);
    props.onStateChange(false);
  }

  const verifyTwoFactorMutation = trpc.twoFactor.verify.useMutation({
    onSuccess: (code: { valid: boolean }) => {
      setLoading(false);

      if (code.valid) {
        closeModal();
        props.onConfirm();
      } else {
        setError("Please enter a valid code");
      }
    },

    onError: (error) => {
      setLoading(false);
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!code) {
      setError("Please enter the code");
      setLoading(false);
      return;
    }

    if (code.length !== 6) {
      setError("Please enter a valid code");
      setLoading(false);
      return;
    }

    verifyTwoFactorMutation.mutate({ code });
  };

  const handleOnChange = (res: string) => {
    setError("");
    setCode(res);
  };

  return (
    <React.StrictMode>
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
                      <IoCloseSharp className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mb-3 flex items-center justify-center">
                    <Logo />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="border-b border-dark pb-6 text-center text-2xl font-normal leading-6"
                  >
                    Two-factor authentication
                  </Dialog.Title>
                  <div className="mt-4">
                    <Paragraph color="light" size="sm" className="pb-6">
                      Two factor authentication is required to continue. Please
                      enter the code from your authenticator app.
                    </Paragraph>

                    <form onSubmit={handleSubmit}>
                      <AuthCode
                        allowedCharacters="numeric"
                        containerClassName="grid grid-cols-6 gap-4 m-3"
                        inputClassName="block appearance-none rounded border border-light/50 bg-darker px-3 py-2 placeholder-light shadow-sm ring-1 ring-light/50 focus:border-dark focus:outline-none focus:ring-light text-center"
                        onChange={handleOnChange}
                      />

                      {error && (
                        <p className="px-3 pt-1 text-xs text-red-400/75">
                          {error}
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={loading}
                        className="mt-10"
                        full={true}
                      >
                        Confirm and continue
                      </Button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </React.StrictMode>
  );
};

export default TwoFactorModal;
