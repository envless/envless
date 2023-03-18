import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { useZodForm } from "@/hooks/useZodForm";
import { trpc } from "@/utils/trpc";
import { Branch } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import { SubmitHandler } from "react-hook-form";
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
import BranchComboBox from "./BranchComboBox";

interface Project {
  name: string;
}

export interface BranchWithNameAndId {
  id: string;
  name: string;
}

interface BranchModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSuccessCreation: () => void;
}

const CreateBranchModal = ({
  isOpen,
  setIsOpen,
  onSuccessCreation,
}: BranchModalProps) => {
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

  const defaultBranches: BranchWithNameAndId[] = [
    { id: "1", name: "main" },
    { id: "2", name: "staging" },
    { id: "3", name: "production" },
  ];

  const [baseBranchFrom, setBaseBranchFrom] = useState(defaultBranches[0]);
  const [branches, setBranches] = useState(defaultBranches);

  const branchMutation = trpc.branches.create.useMutation({
    onSuccess: (data: Branch) => {
      showToast({
        type: "success",
        title: "Branch successfully created",
        subtitle: `You have now created and switched to ${data.name} branch`,
      });
      setIsOpen(false);
      reset();

      onSuccessCreation();
    },

    onError: (error) => {
      showToast({
        type: "error",
        title: "Branch creation failed",
        subtitle: error.message,
      });
    },
  });

  const createNewBranch: SubmitHandler<Project> = async (data) => {
    const { name } = data;

    if (!name) {
      return;
    }

    const projectSlug = router.query.slug as string;

    branchMutation.mutate({ branch: { name: name, projectSlug } });
  };

  return (
    <BaseModal title="New branch" isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit(createNewBranch)}>
        <div className="my-6">
          <label className="relative inline-block text-sm">
            Name
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="absolute top-0 -right-5 h-3.5 w-3.5 hover:text-lighter" />
                </TooltipTrigger>

                <TooltipContent>
                  <div className="flex space-x-4">
                    <AlertCircle className="h-6 w-6 shrink-0 text-teal-300" />
                    <p className="text-xs">
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

        <div className="mb-4">
          <BranchComboBox
            branches={branches}
            selectedBranch={baseBranchFrom}
            setSelectedBranch={setBaseBranchFrom}
            inputLabel="Base Branch"
          />
        </div>

        <div className="float-right">
          <Button type="submit" disabled={branchMutation.isLoading}>
            Create branch
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateBranchModal;
