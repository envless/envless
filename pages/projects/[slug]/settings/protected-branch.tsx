import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useCopyToClipboard from "@/hooks/useCopyToClipBoard";
import { useSeperateBranches } from "@/hooks/useSeperateBranches";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { trpc } from "@/utils/trpc";
import type { Branch, Project } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCheck, Copy, Settings2, ShieldCheck } from "lucide-react";
import { type SubmitHandler, useForm } from "react-hook-form";
import DateTimeAgo from "@/components/DateTimeAgo";
import BranchDropdown from "@/components/branches/BranchDropdown";
import ProjectSettings from "@/components/projects/ProjectSettings";
import { Badge, Button } from "@/components/theme";
import { Table } from "@/components/theme/Table/Table";
import Textarea from "@/components/theme/Textarea";
import { showToast } from "@/components/theme/showToast";
import prisma from "@/lib/prisma";

const initialValue: Branch = {
  createdAt: new Date(),
  createdById: "",
  description: "",
  id: "",
  name: "",
  projectId: "",
  protected: false,
  updatedAt: new Date(),
  status: null,
};

interface ProtectedBranchPageProps {
  projects: Project[];
  currentProject: Project & { branches: Branch[] };
}

/**
 * Setting Page for Protected Branches.
 * @param {SettingProps} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 */

export const ProtectedBranch = ({
  projects,
  currentProject,
}: ProtectedBranchPageProps) => {
  const props = { projects, currentProject };
  const router = useRouter();
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

  const columns: ColumnDef<Branch & { createdBy: { name: string } }>[] = [
    {
      id: "name",
      header: "name",
      cell: (info) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <Badge type="success">
              <ShieldCheck className="h-6 w-6" strokeWidth={2} />
            </Badge>
          </div>
          <div className="ml-4">
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
            <div className="text-light">
              Created by {info.row.original.createdBy.name}{" "}
              <DateTimeAgo date={info.row.original.createdAt} />
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
        <Link
          href={router.asPath}
          className="float-right pr-4 hover:text-teal-400"
        >
          <Settings2 className="h-5 w-5" strokeWidth={2} />
          <span className="sr-only">, {info.row.original.name}</span>
        </Link>
      ),
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const { mutate, isLoading } = trpc.branches.update.useMutation({
    onSuccess: ({ name }: Branch) => {
      showToast({
        type: "success",
        title: `Branch ${name} protected successfully`,
        subtitle: "",
      });
      utils.branches.getAll.invalidate();
      setSelectedBranch(initialValue);
      reset();
    },
    onError: () => {
      showToast({
        type: "success",
        title: `Branch ${selectedBranch.name} protection failed`,
        subtitle: "",
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
        description,
      },
    });
  };

  return (
    <ProjectLayout tab="settings" {...props}>
      <ProjectSettings active="branches" {...props}>
        <h3 className="mb-8 text-lg">Protected branches</h3>
        <div className="flex flex-col">
          <label>Branches</label>
          <BranchDropdown
            label="Selected Branch"
            dropdownLabel="Choose any branch"
            branches={unprotectedBranches}
            selectedBranch={selectedBranch}
            onClick={(branch) => setSelectedBranch(branch)}
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
            <label htmlFor="description">Description</label>
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
      </ProjectSettings>
      <div className="mt-9 w-full">
        <h1 className="text-lg">Protected Branches</h1>
        <Table
          data={protectedBranches}
          columns={columns}
          emptyStateProps={{
            title: "Protected branches",
            description: "No protected branches yet",
            icon: ShieldCheck,
            actionText: "",
            onActionClick: () => {},
          }}
          hasFilters={false}
        />
      </div>
    </ProjectLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
  const user = session?.user;

  // @ts-ignore
  const { slug } = context.params;

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const access = await prisma.access.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
          updatedAt: true,
          branches: true,
        },
      },
    },
  });

  if (!access) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  const projects = access.map((a) => a.project);
  const currentProject = projects.find((p) => p.slug === slug);

  if (!currentProject) {
    return {
      redirect: {
        destination: "/projects",
        permanent: false,
      },
    };
  }

  return {
    props: {
      currentProject: JSON.parse(JSON.stringify(currentProject)),
      projects: JSON.parse(JSON.stringify(projects)),
    },
  };
}

export default ProtectedBranch;

type FormType = {
  description: string;
};
