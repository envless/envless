import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { trpc } from "@/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Branch } from "@prisma/client";
import { useZodForm } from "hooks/useZodForm";
import { AlertCircle } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import {
  BaseInput,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/theme";
import BaseModal from "../theme/BaseModal";
import { showToast } from "../theme/showToast";
import { BranchPopover } from "./BranchPopover";

interface Project {
  name: string;
}

interface BranchModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateBranchModal = ({ isOpen, setIsOpen }: BranchModalProps) => {
  const router = useRouter();

  const schema = z.object({
    name: z
      .string()
      .regex(
        /^[a-z0-9][a-z0-9-]{0,}[a-z0-9]$/,
        "Name can only contain lowercase alphanumeric characters and dashes, cannot start or end with a dash, and must be at least two characters.",
      ),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useZodForm({
    schema,
  });

  const defaultBranches = [
    { id: 1, name: "main", isSelected: true },
    { id: 2, name: "staging", isSelected: false },
    { id: 3, name: "production", isSelected: false },
  ];
  const [loading, setLoading] = useState(false);
  const [baseBranchFrom, setBaseBranchFrom] = useState(defaultBranches[0]);
  const [branches, setBranches] = useState(defaultBranches);

  const branchMutation = trpc.branches.create.useMutation({
    onSuccess: (data: Branch) => {
      showToast({
        type: "success",
        title: "Branch created successfully",
        subtitle: "information about branch",
      });

      // setTimeout(() => {
      //   router.push(`/projects/${data.projectId}/branches`);
      // }, 1000);

      setIsOpen(false);
      reset();
    },

    onError: (error) => {
      showToast({
        type: "error",
        title: "Branch creation failed",
        subtitle: error.message,
      });

      setLoading(false);
    },
  });

  const createNewBranch: SubmitHandler<Project> = async (data) => {
    const { name } = data;
    setLoading(true);

    if (!name) {
      setLoading(false);
      return;
    }

    const projectId = router.query.id as string;

    branchMutation.mutate({ branch: { name: name, projectId } });
  };

  return (
    <BaseModal title="New branch" isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit(createNewBranch)}>
        <div className="my-6">
          <label className="relative inline-block text-sm">
            Name
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="absolute top-0 -right-5 h-3.5 w-3.5 hover:text-lighter" />
                </TooltipTrigger>

                <TooltipContent>
                  <div className="flex space-x-2">
                    <AlertCircle className="h-5 w-5 shrink-0 text-teal-300" />
                    <p>
                      Name can only contain lowercase alphanumeric characters
                      and dashes, cannot start or end with a dash, and must be
                      at least two characters.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>

          <BaseInput
            {...register("name")}
            className="my-2 px-3 py-2"
            name="name"
            required
            full
          />
          {errors.name?.message && (
            <p className="text-xs text-red-500">
              Lowercase alphanumeric characters and dashes only
            </p>
          )}
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
          <Button type="submit" disabled={loading}>
            Create branch
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateBranchModal;
