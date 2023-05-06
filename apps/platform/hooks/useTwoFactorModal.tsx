import React, { useCallback } from "react";
import { Fragment, useState } from "react";
import { trpc } from "@/utils/trpc";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import AuthCode from "react-auth-code-input";
import { Button, Logo, Paragraph } from "@/components/theme";

/**
 * Props for the Modal component.
 * @property {Boolean} open - Whether the modal is open or not.
 * @property {Function} onConfirm - The function to run when the modal is confirmed.
 */

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: Function;
}

/**
 * A modal component.
 * @param {Props} props - The props for the component.
 */
const TwoFactorModal = ({ open, setOpen, onConfirm }: Props) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const { data: session, update } = useSession();

  /**
   * Closes the modal.
   */
  function closeModal() {
    setOpen(false);
  }

  const verifyTwoFactorMutation = trpc.twoFactor.verify.useMutation({
    onSuccess: async (valid: any) => {
      setLoading(false);

      if (valid) {
        closeModal();

        // Update the session
        const updatedSession = {
          ...session,
          user: {
            ...session?.user,
            twoFactorVerified: true,
          },
        };

        await update(updatedSession);

        onConfirm();
      } else {
        setError("Please enter a valid code");
      }
    },

    onError: (error) => {
      setLoading(false);
      setError(error.message);

      if (error.message.includes("Your account has been locked")) {
        signOut();
      }
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
            <div className="bg-darkest fixed inset-0 bg-opacity-25" />
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
                <Dialog.Panel className="bg-darker w-full max-w-md transform overflow-hidden rounded p-8 text-left align-middle shadow-xl shadow-black ring-1 ring-[#222] transition-all">
                  <div className="absolute right-0 top-0 p-3">
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
                    className="border-dark border-b pb-6 text-center text-2xl font-normal leading-6"
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
                        loading={loading}
                        className="mt-10"
                        width="full"
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

/**
 * A custom hook that provides the ability to wrap a mission-critical function with two-factor authentication.
 *
 * @returns {Object} An object containing two properties:
 * - withTwoFactorAuth: a function that takes in another function as an argument and returns a promise. The provided function is only executed after two-factor authentication is confirmed and valid.
 * - TwoFactorModal: a React component that can be used to display a two-factor authentication modal. The component should be rendered without providing any props.
 */

export const useTwoFactorModal = () => {
  const [openModal, setOpenModal] = useState(false);
  const [originalFunction, setOriginalFunction] = useState<Function | null>(
    null,
  );

  const { data: session } = useSession();

  // Wrap a function with two-factor authentication
  const withTwoFactorAuth = useCallback(
    async (fn: Function) => {
      const user = session?.user;

      if (user?.twoFactorEnabled && !user?.twoFactorVerified) {
        setOriginalFunction(() => fn);
        setOpenModal(true);
      } else if (user?.twoFactorVerified) {
        // Two-factor auth already verified, execute the original function
        await fn();
        setOpenModal(false);
      } else {
        // Two-factor auth disabled, execute the original function
        await fn();
        setOpenModal(false);
      }
    },
    [session?.user],
  );

  // Function to run the original function after 2FA is verified
  const runOriginalFunction = useCallback(async () => {
    if (originalFunction) {
      await originalFunction();
      setOriginalFunction(null);
    }
  }, [originalFunction]);

  const WrappedTwoFactorModal = () => (
    <TwoFactorModal
      open={openModal}
      onConfirm={runOriginalFunction}
      setOpen={setOpenModal}
    />
  );

  return {
    withTwoFactorAuth,
    TwoFactorModal: WrappedTwoFactorModal,
  };
};
