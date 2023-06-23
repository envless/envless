import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import type { Keychain, User } from "@prisma/client";
import * as argon2 from "argon2-browser";
import { delay } from "lodash";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import * as openpgp from "openpgp";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { Encryption as EncryptionIcon } from "@/components/icons";
import { Container } from "@/components/theme";
import { Button, Hr, Input } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
import { decrypt, encrypt, generageKeyPair } from "@/lib/encryption/openpgp";

const ALLOWED_RETRIES = 7;

type PageProps = {
  currentUser: User;
  csrfToken: string;
  keychain: Keychain;
};

const EncryptionSetup = ({ keychain, csrfToken, currentUser }: PageProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const { data: session, update: updateSessionWith } = useSession();
  const [loading, setLoading] = useState(false);
  const [retries, setRetries] = useState(0);

  const verifyOneTimePassword = async (data: { password: string }) => {
    const { password } = data;

    try {
      await argon2.verify({
        pass: password,
        encoded: currentUser.hashedPassword as string,
        type: argon2.ArgonType.Argon2id,
      });

      const tempEncryptedPrivateKey = session?.user
        .tempEncryptedPrivateKey as any;

      const privateKeyMessage = await openpgp.readMessage({
        armoredMessage: tempEncryptedPrivateKey,
      });

      const { data: decrypted } = await openpgp.decrypt({
        message: privateKeyMessage,
        passwords: [password],
      });

      debugger;

      // TODO
    } catch (error) {
      debugger;
      let message;

      if (retries >= ALLOWED_RETRIES) {
        message =
          "You have exceeded the maximum number of allowed retries. Please ask your admin to send you a new invite.";
        delay(() => {
          // signOut();
        }, 4000);
      } else if (retries >= 2) {
        message = `You have ${
          ALLOWED_RETRIES - retries
        } attempts left. Please double check your password and try again.`;
      } else {
        message = "Please double check your password and try again.";
      }

      showToast({
        duration: 5000,
        type: "error",
        title: "Password does not match!",
        subtitle: message,
      });

      setRetries(retries + 1);
    }
  };

  return (
    <Container>
      <div className="mt-16">
        <div className="flex flex-col px-5 py-32">
          <div className="bg-darker rounded-md px-10 py-12 sm:mx-auto sm:w-full sm:max-w-xl">
            <EncryptionIcon className="mx-auto mb-3 h-16 w-16 text-teal-400" />
            <h2 className="mt-6 text-center text-2xl">
              Verify your one time password
            </h2>

            <p className="max-w text-light mt-2 text-center text-sm">
              Please enter the one time password sent to your email address.
            </p>

            <Hr className="my-5" />

            <div className="mx-auto max-w-sm">
              <form onSubmit={handleSubmit(verifyOneTimePassword)}>
                <Input
                  type="password"
                  name="password"
                  label="One time password"
                  required
                  full
                  register={register}
                  errors={errors}
                  autoComplete="off"
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                  rightIcon={
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  }
                >
                  Verify one time password
                </Button>
              </form>
            </div>

            <div className="mt-3 text-center">
              <Link
                href="https://envless.dev/docs/encryption"
                target="_blank"
                className="text-xs text-teal-400 hover:text-teal-600"
              >
                How does end-to-end encryption work?
              </Link>
            </div>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </Container>
  );
};

export default EncryptionSetup;