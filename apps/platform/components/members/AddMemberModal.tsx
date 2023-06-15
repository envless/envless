import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useTwoFactorModal } from "@/hooks/useTwoFactorModal";
import { trpc } from "@/utils/trpc";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { capitalize } from "lodash";
import { ArrowRight, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Modal, Select } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
import { generateTempKeychain } from "@/lib/encryption/crypto";
import OpenPGP from "@/lib/encryption/openpgp";

interface MemberProps {
  email: string;
  userId: string;
  role: UserRole;
}

interface AddMemberModalProps {
  projectId: string;
  triggerRefetchMembers: () => void;
}
const selectOptions = Object.values(UserRole).map((role) => ({
  value: role,
  label: capitalize(role),
}));

const AddMemberModal = ({
  projectId,
  triggerRefetchMembers,
}: AddMemberModalProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { withTwoFactorAuth, TwoFactorModal } = useTwoFactorModal();
  const router = useRouter();
  const { data: session } = useSession();

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        role: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
        email: z.string().email("Please enter a valid email address"),
      }),
    ),
  });

  const inviteMutation = trpc.members.invite.useMutation();
  const memberEncryptionMutation = trpc.members.encrypt.useMutation();
  const updateProjectKeyMutation = trpc.projectKey.update.useMutation();
  const initializeMemberMutation = trpc.members.initialize.useMutation();

  const initMemberInvite = async (
    data: MemberProps,
    closeModal: () => void,
  ) => {
    const { email, role } = data;
    setLoading(true);

    initializeMemberMutation.mutate(
      {
        email,
        projectId,
        role: role,
      },
      {
        onSuccess: async (data) => {
          const { member, isNewUser, publicKeys, encryptedProjectKey } =
            data as any as {
              member: {
                id: string;
                name: string;
                email: string;
              };

              isNewUser: boolean;
              publicKeys: string[];
              encryptedProjectKey: string;
            };

          const { id, name, email } = member;

          if (isNewUser) {
            await initializeEncryption(id, name, email);
          } else {
            await reEncryptProjectKey(
              id,
              publicKeys as string[],
              encryptedProjectKey as string,
              closeModal,
            );
          }
        },
        onError: (error) => {
          setLoading(false);
          setError("email", { message: error.message });
        },
      },
    );

    const initializeEncryption = async (
      id: string,
      name: string,
      email: string,
    ) => {
      const {
        pass,
        publicKey,
        hashedPassword,
        verificationString,
        revocationCertificate,
        tempEncryptedPrivateKey,
      } = await generateTempKeychain(id, name, email);

      setPassword(pass);
      const memberId = id;
      memberEncryptionMutation.mutate(
        {
          memberId,
          projectId,
          publicKey,
          hashedPassword,
          verificationString,
          revocationCertificate,
          tempEncryptedPrivateKey: tempEncryptedPrivateKey as string | null,
        },
        {
          onSuccess: async (data) => {
            const { publicKeys, encryptedProjectKey } = data;
            await reEncryptProjectKey(
              memberId,
              publicKeys,
              encryptedProjectKey as string,
              closeModal,
            );
          },

          onError: (error) => {
            setLoading(false);
            setError("email", { message: error.message });
          },
        },
      );
    };
  };

  const submitHandler = (data: any, cb: () => void) => {
    withTwoFactorAuth(() => {
      initMemberInvite(data as MemberProps, cb);
    });
  };

  const reEncryptProjectKey = async (
    memberId: string,
    publicKeys: string[],
    encryptedProjectKey: string,
    closeModal: () => void,
  ) => {
    const privateKey = session?.user.privateKey;

    const decryptedProjectKey = (await OpenPGP.decrypt(
      encryptedProjectKey as string,
      privateKey as string,
    )) as string;

    const encryptedKey = (await OpenPGP.encrypt(
      decryptedProjectKey,
      publicKeys,
    )) as string;

    updateProjectKeyMutation.mutate(
      {
        projectId,
        encryptedKey,
      },
      {
        onSuccess: async (_data) => {
          inviteMutation.mutate(
            {
              memberId,
              projectId,
            },
            {
              onSuccess: () => {
                reset();
                setLoading(false);
                closeModal();
                router.replace(router.asPath);
                triggerRefetchMembers();
                showToast({
                  type: "success",
                  title: "Invitation sent",
                  subtitle: "You have succefully sent an invitation.",
                });
              },

              onError: (error) => {
                setLoading(false);
                setError("email", { message: error.message });
              },
            },
          );
        },
        onError: (error) => {
          setLoading(false);
          setError("email", { message: error.message });
        },
      },
    );
  };

  return (
    <Modal
      button={
        <Button
          leftIcon={<UserPlus className="mr-2 h-4 w-4" strokeWidth={2} />}
          type="button"
          className="float-right"
        >
          Invite team member
        </Button>
      }
      title="Invite team member"
    >
      {({ closeModal }) => (
        <Fragment>
          <TwoFactorModal />
          <form
            onSubmit={handleSubmit((data) => submitHandler(data, closeModal))}
          >
            <Input
              type="email"
              name="email"
              label="Email"
              required
              full
              register={register}
              errors={errors}
              defaultValue={faker.internet.email().toLowerCase()}
              autoCapitalize="off"
            />

            <div className="mb-6">
              <Select
                id="role"
                name="role"
                label="Assign a role"
                className="w-full"
                required
                options={selectOptions}
                defaultValue={UserRole.developer}
                help={
                  <p className="text-light pt-2 text-xs">
                    Learn more about the{" "}
                    <Link href="#" className="text-teal-400">
                      roles
                    </Link>
                    . You can also invite team members and do lot more using{" "}
                    <Link
                      href="https://envless.dev/docs/cli/members"
                      target={"_blank"}
                      className="text-teal-400"
                    >
                      Envless CLI
                    </Link>{" "}
                    commands.
                  </p>
                }
                register={register}
                errors={errors}
              />
            </div>
            <Button
              className="float-right"
              type="submit"
              disabled={loading}
              rightIcon={
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              }
            >
              Send an invite
            </Button>
          </form>
        </Fragment>
      )}
    </Modal>
  );
};

export default AddMemberModal;
