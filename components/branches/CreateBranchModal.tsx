import { useRouter } from "next/router";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { trpc } from "@/utils/trpc";
import { Check, ChevronDown, GitBranch, Search } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Hr, Input } from "@/components/theme";
import BaseModal from "../theme/BaseModal";
import { showToast } from "../theme/showToast";
import BranchPopover from "./BranchPopover";

interface Project {
  name: string;
}

interface BranchModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateBranchModal = ({ isOpen, setIsOpen }: BranchModalProps) => {
  const router = useRouter();
  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const branchMutation = trpc.branches.create.useMutation({
    onSuccess: (data) => {

      showToast({
        type: "success",
        title: "Branch created successfully",
        subtitle: "information about branch",
      });
    },

    onError: (error) => {
      if (error.message.includes("Unique constraint failed")) {
        setError("name", {
          type: "custom",
          message: "Project name already exists",
        });
      }

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

    branchMutation.mutate({ branch: { name: name, projectId: "asdfsad" } });
    reset();
  };

  return (
    <BaseModal title="New branch" isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit(createNewBranch)}>
        <Input
          name="name"
          label="Name"
          required={true}
          full={true}
          register={register}
          errors={errors}
          validationSchema={{
            required: "Branch Name is required",
          }}
        />

        <div className="mb-4 w-full">
          <BranchPopover
            zIndex={100}
            button={
              <button className="inline-flex w-full items-center justify-between space-x-4 rounded  border border-dark px-3 py-2 text-sm ring-1 ring-light/50 transition-colors duration-75 hover:bg-darker">
                <span className="flex flex-row items-center">
                  <div>
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <span className="ml-2 text-xs text-light">Base branch</span>
                </span>

                <div className="flex flex-1 items-center justify-end space-x-2">
                  <span className="font-semibold">main</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>
            }
          >
            <div className="text-xs">
              <div className="border-b border-dark px-3 py-3">
                <p className="font-semibold">Switch between branches</p>
              </div>

              <div className=" mt-1 flex items-center border-b border-dark px-3">
                <Search className="absolute mb-1.5 h-4 w-4 text-light" />
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="w-full border-none bg-transparent pr-3 pl-6 pb-3 text-sm focus:outline-none focus:ring-0"
                  placeholder="Find a branch..."
                />
                <Hr />
              </div>

              <div className="text-sm">
                <ul className="flex w-full flex-col">
                  <button>
                    <li className="inline-flex w-full items-center justify-between px-3 py-2 hover:bg-dark">
                      <span>main</span>
                      <Check
                        className="h-4 w-4 text-teal-300"
                        aria-hidden="true"
                      />
                    </li>
                  </button>

                  <button>
                    <li className="inline-flex w-full items-center justify-between px-3 py-2 hover:bg-dark">
                      staging
                    </li>
                  </button>

                  <button>
                    <li className="inline-flex w-full items-center justify-between px-3 py-2 hover:bg-dark">
                      production
                    </li>
                  </button>
                </ul>
              </div>
            </div>
          </BranchPopover>
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
