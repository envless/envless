import { Dispatch, SetStateAction, useState } from "react";
import { BaseInput, Button } from "@/components/theme";
import { BranchPopover } from "../branches/BranchPopover";
import BaseModal from "../theme/BaseModal";

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

  return (
    <BaseModal title="New Pull Request" isOpen={isOpen} setIsOpen={setIsOpen}>
      <form>
        <div className="my-6">
          <label className="relative inline-block text-sm">Title</label>

          <BaseInput className="my-2 px-3 py-2" name="title" required full />
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
