import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { kebabCase } from "lodash";
import { ArrowRight, Plus } from "lucide-react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
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
    setValue,
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [kebabSlug, setKebabSlug] = useState("");
  const name = watch("name");
  const slug = watch("slug");

  const { projects } = trpc.useContext();

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
    const { name, slug } = data;
    setLoading(true);

    if (!name || !slug) {
      setLoading(false);
      return;
    }

    projectMutation.mutate({ project: { name, slug } });
    reset();
  };

  // Rewrites the slug field to hold a kebab case version of the name field whenever the name field changes.
  useEffect(() => {
    const kebabName = kebabCase(name);
    setKebabSlug(kebabName);
    setValue("slug", kebabName);
  }, [name, setValue]);

  // Rewrites the slug field to hold a kebab case version of itself whenever the slug field changes.
  useEffect(() => {
    const kebabSlug = kebabCase(slug);
    setKebabSlug(kebabSlug);
  }, [slug]);

  useEffect(() => {
    // Check for slug availability after 500 milliseconds of typing
    const timeoutId = setTimeout(async () => {
      if (kebabSlug !== "") {
        const isAvailable = await projects.checkSlugAvailability.fetch({
          slug: kebabSlug,
        });
        if (!isAvailable) {
          setError("slug", { message: "This slug is not available" });
        } else {
          setError("slug", {});
        }
      }
    }, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kebabSlug, setError]);

  return (
    <Modal
      button={
        <Button>
          <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
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
          defaultValue={""}
          required={true}
          full={true}
          register={register}
          errors={errors}
          validationSchema={{
            required: "Project slug is required",
          }}
        />

        <div className="float-right">
          <Button disabled={loading}>
            Save and continue
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
