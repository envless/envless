import Image from "next/image";
import { useState } from "react";
import { UserType } from "@/types/resources";
import clsx from "clsx";
import { Lightbulb } from "lucide-react";
import { useForm } from "react-hook-form";
import zxcvbn from "zxcvbn";
import { Button, Input } from "@/components/theme";

type PageProps = {
  setPage: any;
  reset?: boolean;
  user: UserType;
  csrfToken: string;
};

type SessionParams = {
  email: string;
  password?: string;
};

const MasterPassword = ({ reset, user, setPage, csrfToken }: PageProps) => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [strength, setStrength] = useState({
    score: null,
    timeToHack: "",
  });

  const checkPasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    setStrength({
      score: password === "" ? null : result.score,
      timeToHack:
        result.crack_times_display.offline_slow_hashing_1e4_per_second,
    });
  };

  const onSubmit = async (data: SessionParams) => {
    debugger;
  };

  const PasswordStrength = () => {
    if (strength.score === null) {
      return null;
    } else {
      return (
        <span className="mt-1 flex">
          <Lightbulb className="mr-2 inline h-4 w-4 text-yellow-400" />
          <span className="">
            Time to hack:{" "}
            <span className="font-semibold">{strength.timeToHack}</span>
          </span>
        </span>
      );
    }
  };

  return (
    <div className="flex h-screen flex-col px-12 py-48">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto h-12 w-auto"
          height={100}
          width={100}
          src="/logo.png"
          alt="Envless"
        />
        <h2 className="mt-6 text-center text-2xl">Setup master password</h2>
        <p className="text-light mt-2 text-center text-sm">
          Master password is required for additional security.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-2 py-8 sm:px-8">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }}
          >
            <Input
              name="csrfToken"
              type="hidden"
              register={register}
              defaultValue={csrfToken}
              full={true}
            />

            <Input
              name="password"
              type="password"
              label="Master password"
              placeholder="****************"
              required={true}
              full={true}
              register={register}
              errors={errors}
              help={<PasswordStrength />}
              onKeyUp={(e) => {
                const value = e.currentTarget.value;
                checkPasswordStrength(value);
              }}
              validationSchema={{
                required: "Password is required",
                minLength: {
                  value: 12,
                  message: "Password must be at least 12 characters",
                },
                validate: (value: string) => {
                  checkPasswordStrength(value);
                  return true;
                },
              }}
              defaultValue={
                process.env.NODE_ENV === "development" ? "P{3}ssw[0]rd!" : ""
              }
            />

            <Input
              name="repeatPassword"
              type="password"
              label="Confirm master password"
              placeholder="****************"
              required={true}
              full={true}
              register={register}
              errors={errors}
              validationSchema={{
                required: "Password confirmation is required",
                validate: (value: string) =>
                  value === watch("password") || "Passwords do not match",
              }}
              defaultValue={
                process.env.NODE_ENV === "development" ? "P{3}ssw[0]rd!" : ""
              }
            />

            <Button
              sr={"Master password button"}
              type="submit"
              width="full"
              // disabled={loading}
            >
              Setup master password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

MasterPassword.defaultProps = {
  reset: false,
};

export default MasterPassword;
