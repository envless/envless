import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { KeychainType, UserType } from "@/types/resources";
import { trpc } from "@/utils/trpc";
import type { Keychain } from "@prisma/client";
import * as argon2 from "argon2-browser";
import { createHash, randomBytes } from "crypto";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
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

const EncryptionSetup = ({
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

  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="flex flex-col px-5 py-32">
        <div className="bg-darker rounded-md px-10 py-12 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="">
            <EncryptionIcon className="mx-auto mb-3 h-16 w-16 text-teal-400" />
            <h2 className="mt-6 text-center text-2xl">
              Setup end-to-end encryption
            </h2>
            <p className="text-light mt-2 text-center text-sm">
              Generate and download your encryption keys. Encryption keys are
              generated on the client side and never saved on our database,
              encrypted or otherwise. We recommend you further encrypt and store
              this private key to your most trusted password manager (eg.
              BitWarden) or on a safe place. Secrets cannot be decrypted without
              this key and you will need this this key everytime you login.
            </p>
          </div>

          <div className="mt-8">
            <Button
              sr={"Generate and download encryption keys"}
              type="submit"
              width="full"
              disabled={loading}
            >
              Generate and download encryption keys
            </Button>
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
    </>
  );
};

export default EncryptionSetup;
