import { useRouter } from "next/router";
import { useState } from "react";
import { KeychainType, UserType } from "@/types/resources";
import { trpc } from "@/utils/trpc";
import type { Keychain } from "@prisma/client";
import * as argon2 from "argon2-browser";
import { createHash, randomBytes } from "crypto";
import { Lightbulb } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import zxcvbn from "zxcvbn";
import { Encryption as EncryptionIcon } from "@/components/icons";
import { Button, Hr, Input } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
import AES from "@/lib/encryption/aes";
import OpenPGP from "@/lib/encryption/openpgp";

type PageProps = {
  setPage: any;
  user: UserType;
  page: string;
  keychain: Keychain;
  csrfToken: string;
};

type SessionParams = {
  email: string;
  password?: string;
};

const MasterPassword = ({
  user,
  setPage,
  csrfToken,
  page,
  keychain,
}: PageProps) => {
  const router = useRouter();
  const { data: session, update: updateSessionWith } = useSession();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState({
    score: 0,
    timeToHack: "",
  });

  const checkPasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    setStrength({
      score: password === "" ? 0 : result.score,
      timeToHack: result.crack_times_display
        .offline_slow_hashing_1e4_per_second as string,
    });
  };

  const decryptAndUpdateSession = async (keychain: Keychain) => {
    const key = createHash("sha256")
      .update(String(password))
      .digest("base64")
      .substr(0, 32);

    const { encryptedPrivateKey } = keychain as any as KeychainType;

    const privateKey = await AES.decrypt({
      ciphertext: encryptedPrivateKey?.ciphertext,
      iv: encryptedPrivateKey?.iv,
      tag: encryptedPrivateKey?.tag,
      key: key,
    });

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        hasMasterPassword: true,
        privateKey: privateKey,
      },
    };

    await updateSessionWith(newSession);
    await setPage("verifyIdentify");
  };

  const onSubmit = async (data: SessionParams) => {
    setLoading(true);
    setPassword(data.password as string);

    debugger;

    switch (page) {
      case "setupPassword":
        await setupPassword(data);
        break;
      case "setupKeychain":
        await setupKeychain(data);
        break;
      case "setupPasswordForInvitedUser":
        await setupPasswordForInvitedUser(data);
        break;
      default:
        break;
    }
  };

  const { mutateAsync: createPasswordMutation } =
    trpc.auth.createPassword.useMutation({
      onSuccess: async (response) => {
        const { keychain } = response;
        await decryptAndUpdateSession(keychain as Keychain);
      },

      onError: (error) => {
        debugger;
      },
    });

  const { mutateAsync: verifyPasswordMutation } =
    trpc.auth.verifyPassword.useMutation({
      onSuccess: async (response) => {
        const { keychain } = response;
        await decryptAndUpdateSession(keychain as Keychain);
      },

      onError: (error) => {
        debugger;
      },
    });

  const setupPassword = async (data: SessionParams) => {
    const params = await encryptionParams(data);
    return await createPasswordMutation(params);
  };

  const setupKeychain = async (data: SessionParams) => {
    try {
      const _password = data.password as string;
      return await verifyPasswordMutation({ password: _password });
    } catch (error) {
      showToast({
        duration: 10000,
        type: "error",
        title: "Oops! there is an error.",
        subtitle: "Please check your password and try again.",
      });
    }
  };

  const setupPasswordForInvitedUser = async (data: SessionParams) => {
    const params = await encryptionParams(data);
    debugger;
  };

  const encryptionParams = async (data: SessionParams) => {
    const salt = randomBytes(32).toString("hex");
    const key = createHash("sha256")
      .update(String(data.password))
      .digest("base64")
      .substr(0, 32);

    const pgp = await OpenPGP.generageKeyPair(user.name as string, user.email);
    const encryptedPrivateKey = await AES.encrypt({
      plaintext: pgp.privateKey,
      key: key,
    });

    const { encoded: hashedPassword } = (await argon2.hash({
      pass: data.password,
      salt,
      type: argon2.ArgonType.Argon2id,
    })) as { encoded: string };

    return {
      publicKey: pgp.publicKey as string,
      hashedPassword: hashedPassword,
      encryptedPrivateKey: encryptedPrivateKey,
      revocationCertificate: pgp.revocationCertificate,
    } as {
      hashedPassword: string;
      publicKey: string;
      encryptedPrivateKey: {
        ciphertext: string;
        iv: string;
        tag: string;
      };
      revocationCertificate: string;
    };
  };

  const PasswordStrength = () => {
    if (strength.score === null) {
      return null;
    } else {
      return (
        <span className="mt-1 flex">
          <Lightbulb
            strokeWidth={2.5}
            className="mr-2 inline h-4 w-4 text-yellow-300"
          />
          <span className="">
            Time to hack:{" "}
            <span className="font-semibold">{strength.timeToHack}</span>
          </span>
        </span>
      );
    }
  };

  return (
    <>
      <div className="flex flex-col px-5 py-32">
        <div className="bg-darker rounded-md px-5 py-12 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="">
            <EncryptionIcon className="mx-auto mb-3 h-16 w-16 text-teal-400" />
            <h2 className="mt-6 text-center text-2xl">
              {page == "setupKeychain" ? "Enter" : "Setup"} master password
            </h2>
            <p className="text-light mt-2 text-center text-sm">
              Master password is required for additional security.
            </p>
          </div>

          <div className="">
            <div className="px-2 py-8 sm:px-8">
              <Hr />
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
                    setLoading(false);
                    if (page === "setupKeychain") return true;
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
                      if (page === "setupKeychain") return true;
                      checkPasswordStrength(value);
                      return true;
                    },
                  }}
                  defaultValue={
                    process.env.NODE_ENV === "development"
                      ? "P{3}ssw[0]rd!"
                      : ""
                  }
                />

                {page != "setupKeychain" && (
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
                      process.env.NODE_ENV === "development"
                        ? "P{3}ssw[0]rd!"
                        : ""
                    }
                  />
                )}

                <Button
                  sr={"Master password button"}
                  type="submit"
                  width="full"
                  disabled={loading}
                >
                  Continue with master password
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default MasterPassword;
