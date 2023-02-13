import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Dropdown, Input, Modal } from "@/components/theme";

interface NewMember {
  email: string;
  userId: string;
}

const AddMemberModal = ({ userId, projectId }) => {
  const router = useRouter();
  const [role, setRole] = useState("developer");
  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      }),
    ),
  });
  const [loading, setLoading] = useState(false);

  const inviteMembers: SubmitHandler<NewMember> = async (data) => {
    const { email } = data;
    setLoading(true);
    console.log("inviteMembers", email, role, projectId);
    await signIn("invite", {
      email,
      redirect: false,
      callbackUrl: `/api/invite/accept?projectId=${projectId}&role=${role}`,
    });

    setLoading(false);

    reset();
  };

  const menuItems = [
    {
      title: "Developer",
      handleClick: () => setRole("developer"),
    },
    {
      title: "Maintainer",
      handleClick: () => setRole("maintainer"),
    },
  ];

  return (
    <Modal
      button={
        <Button className="float-right">
          <UserPlus className="mr-2 h-4 w-4 " strokeWidth={2} />
          Invite member
        </Button>
      }
      title="Add new member"
    >
      <form onSubmit={handleSubmit(inviteMembers)}>
        <Input
          type="email"
          name="email"
          label="New member email"
          required
          full
          register={register}
          errors={errors}
        />

        <div className="mb-6">
          <Dropdown
            button={<p className="text-sm">{`Selected role: ${role}`}</p>}
            items={menuItems}
            itemsPosition="bottom-0"
          />
        </div>
        <Button type="submit" disabled={loading}>
          Invite
          <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      </form>
    </Modal>
  );
};

export default AddMemberModal;
