import Link from "next/link";
import { useState } from "react";
import { useTwoFactorModal } from "@/hooks/useTwoFactorModal";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { capitalize } from "lodash";
import { ArrowRight, UserPlus } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Modal, Select } from "@/components/theme";
import { showToast } from "@/components/theme/showToast";

interface MemberProps {
  email: string;
  userId: string;
  role: UserRole;
}

const selectOptions = Object.values(UserRole).map((role) => ({
  value: role,
  label: capitalize(role),
}));

const AddMemberModal = ({ projectId }) => {
  const [loading, setLoading] = useState(false);

  const { withTwoFactorAuth, TwoFactorModal } = useTwoFactorModal();

  const {
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

  const inviteMutation = trpc.members.invite.useMutation({
    onSuccess: (_data) => {
      setLoading(false);
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
  });

  const inviteMembers: SubmitHandler<MemberProps> = async (data) => {
    const { email, role } = data;
    setLoading(true);

    await inviteMutation.mutate({
      email,
      projectId,
      role: role,
    });

    setLoading(false);
  };

  const submitHandler = (data) => {
    withTwoFactorAuth(() => {
      inviteMembers(data as MemberProps);
    });
  };

  return (
    <Modal
      button={
        <Button type="button" className="float-right">
          <UserPlus className="mr-2 h-4 w-4 " strokeWidth={2} />
          <span className="hidden sm:block">Invite team member</span>
          <span className="block sm:hidden">Invite member</span>
        </Button>
      }
      title="Invite team member"
    >
      <TwoFactorModal />

      <form onSubmit={handleSubmit(submitHandler)}>
        <Input
          type="email"
          name="email"
          label="Email"
          required
          full
          register={register}
          errors={errors}
        />

        <div className="mb-6">
          <Select
            id="role"
            name="role"
            label="Assign a role"
            className="w-full"
            required
            options={selectOptions}
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
        <Button className="float-right" type="submit" disabled={loading}>
          Send an invite
          <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      </form>
    </Modal>
  );
};

export default AddMemberModal;
