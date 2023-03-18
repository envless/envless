import { type GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import { useZodForm } from "@/hooks/useZodForm";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project, PullRequest, User } from "@prisma/client";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BranchDropdown from "@/components/branches/BranchDropdown";
import ProjectSettings from "@/components/projects/ProjectSettings";
import { Button } from "@/components/theme";
import { Table } from "@/components/theme/Table/Table";
import Textarea from "@/components/theme/TextareaGroup";
import prisma from "@/lib/prisma";

interface ProtectedBranchPageProps {
  projects: Project[];
  currentProject: Project;
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

  // const {
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  const schema = z.object({
    description: z.string(),
  });
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useZodForm({
    schema,
  });

  const submitForm = (data) => {
    console.log(data, "hello");
  };
  const defaultBranches = [
    { id: 1, name: "main", isSelected: true },
    { id: 2, name: "staging", isSelected: false },
    { id: 3, name: "production", isSelected: false },
    { id: 4, name: "feat/upload-env-file", isSelected: false },
  ];

  const [selectedBranch, setSelectedBranch] = useState(defaultBranches[0]);

  const [branches, setBranches] = useState(defaultBranches);

  return (
    <ProjectLayout tab="settings" {...props}>
      <ProjectSettings active="branches" {...props}>
        <h3 className="mb-8 text-lg">Protected branches</h3>
        <div className="flex flex-col">
          <label>Branches</label>
          <BranchDropdown
            label="Selected Branch"
            dropdownLabel="Choose any branch"
            branches={branches}
            setBranches={setBranches}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
          />
        </div>
        <div className="mt-6 w-full lg:w-3/5">
          <form onSubmit={handleSubmit(submitForm)}>
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              name="description"
              className="mt-4"
              placeholder="Used for production environments"
              icon={false}
            />
            <Button className="mt-6" type="submit" disabled={false}>
              Save
            </Button>
          </form>
        </div>
      </ProjectSettings>
      {/* TODO: Full Page Table Here with protected-branches list*/}
      <div className="mt-6 w-full">
        <Table
          data={[]}
          columns={[]}
          emptyStateProps={{
            title: "Protected branches",
            description: "No protected branches yet",
            icon: ShieldCheck,
            actionText: "",
            onActionClick: () => {},
          }}
          hasFilters={false}
        ></Table>
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
      // @ts-ignore
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
