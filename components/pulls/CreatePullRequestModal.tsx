import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { PullRequest } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { BaseInput, Button } from "@/components/theme";
import { BranchPopover } from "../branches/BranchPopover";
import BaseModal from "../theme/BaseModal";
import { showToast } from "../theme/showToast";

interface PullRequestType {
  title: string;
  projectId: string;
}

interface BranchModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CreatePullRequestModal = ({ isOpen, setIsOpen }: BranchModalProps) => {
  const defaultBranches = [
    { id: 1, name: "main", isSelected: true },
    { id: 2, name: "staging", isSelected: false },
    { id: 3, name: "production", isSelected: false },
  ];
  const [baseBranchFrom, setBaseBranchFrom] = useState(defaultBranches[0]);
  const [branches, setBranches] = useState(defaultBranches);

  const router = useRouter();

  const schema = z.object({
    title: z.string(),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const pullRequestMutation = trpc.pullRequest.create.useMutation({
    onSuccess: (data: PullRequest) => {
      showToast({
        type: "success",
        title: "Pull Request successfully created",
        subtitle: `Pull Request created`,
      });
      setIsOpen(false);
      reset();
    },
  });

  const createNewBranch: SubmitHandler<PullRequestType> = async (data) => {
    const { title } = data;

    if (!title) {
      return;
    }

    const projectId = router.query.id as string;

    pullRequestMutation.mutate({ pullRequest: { title, projectId } });
  };

  return (
    <BaseModal title="New Pull Request" isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit(createNewBranch)}>
        <div className="my-6">
          <label className="relative inline-block text-sm">Title</label>

          <BaseInput
            {...register("title")}
            className="my-2 px-3 py-2"
            name="title"
            required
            full
          />
        </div>

        <div className="mb-4 w-full">
          <BranchPopover
            zIndex={30}
            outlined
            fullWidth
            buttonText="Current Branch"
            branches={branches}
            setBranches={setBranches}
            selectedBranch={baseBranchFrom}
            setSelectedBranch={setBaseBranchFrom}
          />
        </div>

        <div className="mb-4 w-full">
          <BranchPopover
            outlined
            fullWidth
            buttonText="Base Branch"
            branches={branches}
            setBranches={setBranches}
            selectedBranch={baseBranchFrom}
            setSelectedBranch={setBaseBranchFrom}
          />
        </div>

        <div className="float-right">
          <Button type="submit">Create Pull Request</Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreatePullRequestModal;
