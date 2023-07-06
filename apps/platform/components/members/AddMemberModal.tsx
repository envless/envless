import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useTwoFactorModal } from "@/hooks/useTwoFactorModal";
import { downloadAsTextFile } from "@/utils/helpers";
import { trpc } from "@/utils/trpc";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { capitalize } from "lodash";
import { ArrowRight, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import * as csvParser from "papaparse";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Modal, Select } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";
import { decrypt, encrypt, generageKeyPair } from "@/lib/encryption/openpgp";

interface MemberProps {
  email: string;
  userId: string;
  role: UserRole;
  name?: string;
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

  const createMemberMutation = trpc.members.createInvite.useMutation();

  const createTeamMember = async (
    data: MemberProps,
    closeModal: () => void,
  ) => {
    setLoading(true);
    const { name, email, role } = data;
    const keypair = await generageKeyPair(name as string, email);
    const { publicKey, privateKey, revocationCertificate } = keypair;

    createMemberMutation.mutate(
      {
        name,
        email,
        publicKey,
        projectId,
        role: role,
        revocationCertificate,
      },
      {
        onSuccess: async (data) => {
          const { publicKeys, invitation, encryptedProjectKey } = data;
          const csvData = [
            {
              Name: name || "",
              Email: email,
              "Invitation Link": invitation,
              "PGP Private Key": privateKey,
            },
          ];

          const csv = await csvParser.unparse(csvData);
          downloadAsTextFile(`envless-invitation-(${email}).csv`, csv);

          showToast({
            duration: 10000,
            type: "success",
            title: "Successfully added a team member",
            subtitle:
              "You have successfully added a team member to your project. Please securely share the downloaded file so they can access the project.",
          });

          triggerRefetchMembers();
          closeModal();
        },
        onError: (error) => {
          setError("email", { message: error.message });
        },

        onSettled: () => {
          setLoading(false);
        },
      },
    );
  };

  const submitHandler = (data: any, cb: () => void) => {
    withTwoFactorAuth(() => {
      createTeamMember(data as MemberProps, cb);
    });
  };

  return (
    <Modal
      button={
        <Button
          leftIcon={<UserPlus className="mr-2 h-4 w-4" strokeWidth={2} />}
          type="button"
          className="float-right"
        >
          Add team member
        </Button>
      }
      title="Add a team member"
    >
      {({ closeModal }) => (
        <Fragment>
          <TwoFactorModal />
          <form
            onSubmit={handleSubmit((data) => submitHandler(data, closeModal))}
          >
            <Input
              type="text"
              name="name"
              label="Full name (optional)"
              full
              register={register}
              errors={errors}
              autoCapitalize="off"
            />

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
                    commands. Clicking on the button below will download the
                    login credentials for the invited member. Please share it
                    with the member most secure way possible.
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
              Invite and download login credentials
            </Button>
          </form>
        </Fragment>
      )}
    </Modal>
  );
};

export default AddMemberModal;
