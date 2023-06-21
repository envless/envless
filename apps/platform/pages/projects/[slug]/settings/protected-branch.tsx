import { useState } from "react";
import useCopyToClipboard from "@/hooks/useCopyToClipBoard";
import { useSeperateBranches } from "@/hooks/useSeperateBranches";
import ProjectLayout from "@/layouts/Project";
import { trpc } from "@/utils/trpc";
import { withAccessControl } from "@/utils/withAccessControl";
import { Branch, MembershipStatus, Project, UserRole } from "@prisma/client";
import { CheckCheck, Copy, ShieldCheck, ShieldOff } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import BranchDropdown from "@/components/branches/BranchDropdown";
import ProjectSettings from "@/components/projects/ProjectSettings";
import { Button } from "@/components/theme";
import { Table } from "@/components/theme/Table/Table";
import Textarea from "@/components/theme/TextareaGroup";
import { showToast } from "@/components/theme/showToast";

const initialValue: Branch = {
  createdAt: new Date(),
  createdById: "",
  description: "",
  id: "",
  name: "",
  projectId: "",
  protected: false,
  protectedAt: null,
  updatedAt: new Date(),
};

/**
 * A functional component that represents a project.
 * @param {SettingProps} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {currentRole} props.currentRole - The user role in current project.
 */
interface ProtectedBranchPageProps {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
}

export const ProtectedBranch = ({
  projects,
  currentProject,
  currentRole,
}: ProtectedBranchPageProps) => {
  const props = {
    projects,
    currentProject,
    currentRole,
  };

  const [copiedValue, copy, setCopiedValue] = useCopyToClipboard();
  const utils = trpc.useContext();

  const branchQuery = trpc.branches.getAll.useQuery(
    {
      projectId: currentProject.id,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const { protected: protectedBranches, unprotected: unprotectedBranches } =
    useSeperateBranches(branchQuery.data || []);

  const [selectedBranch, setSelectedBranch] = useState<Branch>(initialValue);

  const columns = [
    {
      id: "name",
      header: "name",
      cell: (info) => (
        <div className="flex items-center">
          <div>
            <div className="flex items-center">
              {copiedValue === info.row.original.name ? (
                <button
                  aria-label="Copied!"
                  data-balloon-pos="down"
                  className="inline-flex cursor-copy font-medium"
                >
                  <CheckCheck
                    className="mr-2 h-4 w-4 text-teal-400"
                    strokeWidth={2}
                  />
                </button>
              ) : (
                <button className="inline-flex cursor-copy font-medium">
                  <Copy
                    onClick={() => {
                      copy(info.row.original.name as string);
                      setTimeout(() => {
                        setCopiedValue("");
                      }, 2000);
                    }}
                    className="mr-2 h-4 w-4"
                    strokeWidth={2}
                  />
                </button>
              )}
              {info.row.original.name}
            </div>
            <div className="text-light">{info.row.original.description}</div>
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <button
          aria-label="This branch is protected, click here to remove protection"
          data-balloon-pos="up"
          className="rounded-full p-2 text-white transition duration-200 hover:bg-white/25"
          onClick={() => {
            const confirmed = confirm(
              `Are you sure you want to remove protection from ${info.row.original.name} branch ?`,
            );
            if (confirmed) {
              mutate({
                branch: {
                  ...info.row.original,
                  protected: false,
                },
              });
            }
          }}
        >
          <ShieldOff className="h-5 w-5 text-red-500" strokeWidth={2} />
          <span className="sr-only">, {info.row.original.name}</span>
        </button>
      ),
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    setValue,
  } = useForm();

  const { mutate, isLoading } = trpc.branches.update.useMutation({
    onSuccess: ({ name }: Branch) => {
      showToast({
        type: "success",
        title: `You have successfully removed protection for branch - ${name}.`,
        subtitle: "",
      });
      utils.branches.getAll.invalidate();
      setSelectedBranch(initialValue);
      reset();
    },
    onError: (error) => {
      showToast({
        type: "error",
        title: `Branch ${selectedBranch.name} protection failed`,
        subtitle: error.message,
      });
    },
  });

  const submitForm: SubmitHandler<FormType> = (values) => {
    const { description } = values;
    if (!selectedBranch.id) {
      return;
    }

    mutate({
      branch: {
        ...selectedBranch,
        protected: true,
        protectedAt: new Date(),
        description,
      },
    });
  };

  return (
    <ProjectLayout tab="settings" {...props}>
      <ProjectSettings active="branches" {...props}>
        <h3 className="mb-8 text-lg">Protected branches</h3>
        <div className="flex flex-col">
          <label className="text-sm">Select a branch</label>
          <BranchDropdown
            label="Selected Branch"
            dropdownLabel="Choose any branch"
            branches={unprotectedBranches}
            selectedBranch={selectedBranch}
            onClick={(branch) => {
              setSelectedBranch(branch);
              setValue("description", branch.description);
            }}
            currentProjectSlug={currentProject.slug}
            full
          />
          {isSubmitted && !selectedBranch.id && (
            <div className="mt-2 text-xs text-red-400/75">
              Please select a branch
            </div>
          )}
        </div>
        <div className="mt-6 w-full lg:w-3/5">
          <form onSubmit={handleSubmit(submitForm)}>
            <label htmlFor="description" className="text-sm">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              className="mt-4"
              defaultValue={selectedBranch.description || ""}
              placeholder="Used for production environments"
              register={register}
              validationSchema={{
                required: "Description is required",
              }}
              errors={errors}
            />
            <Button className="mt-6" type="submit" disabled={isLoading}>
              Protect
            </Button>
          </form>
        </div>

        <div className="mt-5 w-full lg:w-3/5">
          <Table
            data={protectedBranches}
            columns={columns}
            emptyStateProps={{
              title: "Protected branches",
              description: "No protected branches yet",
              icon: ShieldCheck,
              actionText: "",
            }}
            overflow="overflow-visible"
            hasFilters={false}
          />
        </div>
      </ProjectSettings>
    </ProjectLayout>
  );
};

export const getServerSideProps = withAccessControl({
  hasAccess: {
    roles: [UserRole.maintainer, UserRole.owner],
    statuses: [MembershipStatus.active],
  },
});

export default ProtectedBranch;

type FormType = {
  description: string;
};
