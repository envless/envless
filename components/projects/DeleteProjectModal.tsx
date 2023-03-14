import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import type { Project } from "@prisma/client";
import { ArrowRight, TrashIcon } from "lucide-react";
import { Button, Modal, Paragraph } from "@/components/theme";
import { showToast } from "../theme/showToast";

interface DeleteProjectModalProps {
  project: Project;
}

const DeleteProjectModal = ({ project }: DeleteProjectModalProps) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { mutate: projectDeleteMutation, isLoading } =
    trpc.projects.delete.useMutation({
      onSuccess: () => {
        showToast({
          type: "success",
          title: "Project Deleted successfully",
          subtitle: "",
        });
        router.push("/projects");
      },
      onError: (error) => {
        showToast({
          type: "error",
          title: "Project Delete failed",
          subtitle: error.message,
        });
        setLoading(false);
      },
    });

  const submitForm = () => {
    setLoading(true);
    projectDeleteMutation({
      project,
    });
  };

  return (
    <Modal
      button={
        <Button type="button" variant="danger-outline">
          Delete this project
        </Button>
      }
      title="Delete this project?"
    >
      <div className="flex flex-col items-center gap-3">
        <Paragraph size="sm" className="mt-4 text-center text-sm font-light">
          Once you delete a project, there is no going back. Please be certain.
        </Paragraph>
        <Button variant="danger" disabled={loading} onClick={submitForm}>
          Confirm Delete
          <TrashIcon className="ml-2 h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteProjectModal;
