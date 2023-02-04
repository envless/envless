import { useState } from "react";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import AuthCode from "react-auth-code-input";
import { Button, LoadingIcon } from "@/components/theme";

/**
  @interface TwoFactorFormProps
  @property {() => void} onConfirm - callback function called when form is confirmed
*/

interface TwoFactorFormProps {
  onConfirm: () => void;
}

/**
  TwoFactorForm - A functional component that renders a form for two-factor authentication
  @param {TwoFactorFormProps} props - The props for the component
*/

const TwoFactorForm: React.FC<TwoFactorFormProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleOnChange = (res: string) => {
    setError("");
    setCode(res);

    if (res.length === 6) {
      setLoading(true);
      verifyTwoFactorMutation.mutate({ code: res });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6 digit code.");
      setLoading(false);
      return;
    }

    verifyTwoFactorMutation.mutate({ code });
  };

  const verifyTwoFactorMutation = trpc.twoFactor.verify.useMutation({
    onSuccess: (data) => {
      setLoading(false);

      // @ts-ignore
      if (data?.valid) {
        props.onConfirm();
      } else {
        setError("Invalid code. Please try again.");
      }
    },

    onError: (error) => {
      setLoading(false);
      setError(error.message);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <AuthCode
        allowedCharacters="numeric"
        containerClassName="grid grid-cols-6 gap-4 m-3"
        inputClassName="block appearance-none rounded border border-light-50/50 bg-dark-800 px-3 py-2 placeholder-light-50 shadow-sm ring-1 ring-light-50/50 focus:border-dark-700 focus:outline-none focus:ring-light-50 text-center"
        onChange={handleOnChange}
      />

      {error && <p className="px-3 pt-1 text-xs text-red-400/75">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className={clsx("mt-10", loading && "cursor-not-allowed")}
        full={true}
      >
        {loading && <LoadingIcon className="h-4 w-4 text-dark-700" />}
        Confirm and continue
      </Button>
    </form>
  );
};

export default TwoFactorForm;
