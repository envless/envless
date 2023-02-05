import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, UserPlus } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Modal } from "@/components/theme";

interface NewMember {
  email: string;
}

const AddMemberModal = ({ projectId }) => {
  const router = useRouter();
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

  const projectMutation = trpc.members.inviteMember.useMutation({
    onSuccess: (data) => {},

    onError: (error) => {
      // if (error.message.includes("Unique constraint failed")) {
      //   setError("name", {
      //     type: "custom",
      //     message: "Project name already exists",
      //   });
      // }

      setLoading(false);
    },
  });

  const inviteMembers: SubmitHandler<NewMember> = async (data) => {
    const { email } = data;
    setLoading(true);

    if (!email) {
      setLoading(false);
      return;
    }
    console.log({ email });
    projectMutation.mutate({ memberEmail: email, projectId });
    reset();
  };

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

        <div className="float-right">
          <Button type="submit" disabled={loading}>
            Invite
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemberModal;
