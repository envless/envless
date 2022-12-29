import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Input, Modal } from "@/components/theme";
import { PlusIcon, ArrowRightIcon } from "@heroicons/react/20/solid";

interface Project {
  name: string;
}

const CreateProjectModal = () => {
  const router = useRouter();
  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const projectMutation = trpc.projects.create.useMutation({
    onSuccess: (data) => {
      const { id } = data;
      router.push(`/projects/${id}`);
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

  const createNewProject: SubmitHandler<Project> = async (data) => {
    const { name } = data;
    setLoading(true);

    if (!name) {
      setLoading(false);
      return;
    }

    projectMutation.mutate({ project: { name: name } });
    reset();
  };

  return (
    <Modal
      button={
        <Button>
          <PlusIcon className="mr-2 h-5 w-5" aria-hidden="true" />
          New project
        </Button>
      }
      title="Create a new project"
    >
      <form onSubmit={handleSubmit(createNewProject)}>
        <Input
          name="name"
          label="Project name"
          placeholder="Untitled"
          defaultValue="Untitled"
          required={true}
          register={register}
          errors={errors}
          validationSchema={{
            required: "Project name is required",
          }}
        />

        <div className="float-right">
          <Button type="submit" disabled={loading}>
            Save and continue
            <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
