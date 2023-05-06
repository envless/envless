import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { kebabCase } from "lodash";
import { ArrowRight, Plus } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Input, Modal } from "@/components/theme";

interface Project {
  name: string;
  slug: string;
}

const CreateProjectModal = () => {
  const router = useRouter();
  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [kebabSlug, setKebabSlug] = useState("");
  const watchName = watch("name");
  const watchSlug = watch("slug");

  const { projects } = trpc.useContext();

  const { mutate: projectMutation, isLoading } =
    trpc.projects.create.useMutation({
      onSuccess: (data) => {
        const { slug } = data;
        router.push(`/projects/${slug}`);
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

    if (!name || !kebabSlug) {
      setLoading(false);
      return;
    }

    await projectMutation({ project: { name, slug: kebabSlug } });
  };

  useEffect(() => {
    if (!watchName) {
      setValue("slug", "");
      return;
    }
    const kebabName = kebabCase(watchName);
    setKebabSlug(kebabName);
    setValue("slug", kebabName);
  }, [watchName, setValue]);

  useEffect(() => {
    if (!watchSlug) clearErrors(["slug"]);
    const kebabSlug = kebabCase(watchSlug);

    setKebabSlug(kebabSlug);
  }, [watchSlug, setValue, clearErrors]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (kebabSlug || watchName) {
        const { conflictField } =
          await projects.checkSlugOrNameAvailability.fetch({
            slug: kebabSlug,
            name: watchName,
          });

        if (conflictField === "slug") {
          setError("slug", { message: "This slug is not available" });
          clearErrors(["name"]);
        } else if (conflictField === "name") {
          setError("name", { message: "This name is not available" });
          clearErrors(["slug"]);
        } else {
          clearErrors(["slug", "name"]);
        }
      }
    }, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kebabSlug, watchName, setError]);

  return (
    <Modal
      button={
        <Button leftIcon={<Plus className="mr-2 h-5 w-5" aria-hidden="true" />}>
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
          required={true}
          full={true}
          register={register}
          errors={errors}
          validationSchema={{
            required: "Project name is required",
          }}
        />
        <Input
          name="slug"
          label="Slug"
          placeholder="Untitled"
          required={true}
          full={true}
          register={register}
          errors={errors}
          validationSchema={{
            required: "Project slug is required",
          }}
        />

        <div className="float-right">
          <Button
            rightIcon={
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            }
            loading={loading}
          >
            Save and continue
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
