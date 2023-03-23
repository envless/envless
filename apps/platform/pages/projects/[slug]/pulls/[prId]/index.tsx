import { type GetServerSidePropsContext } from "next";
import ProjectLayout from "@/layouts/Project";
import Project from "@/models/projects";
import { getOne as getSinglePr } from "@/models/pullRequest";
import { getServerSideSession } from "@/utils/session";
import { GitPullRequestClosed } from "lucide-react";
import DetailedPrTitle from "@/components/pulls/DetailedPrTitle";
import EnvDiffViewer from "@/components/pulls/EnvDiffViewer";
import { Button } from "@/components/theme";
import prisma from "@/lib/prisma";

export default function PullRequestDetailPage({
  projects,
  currentProject,
  pullRequest,
}) {
  const oldCode = `
  # SMTP
  EMAIL_SERVER=smtp://username:password@smtp.example.com:587
  EMAIL_FROM=email@example.com
`;
  const newCode = `
# SMTP
EMAIL_SERVER=smtp://hari:password@smtp.example.com:587
EMAIL_FROM=email@example.com
`;

  return (
    <ProjectLayout tab="pr" projects={projects} currentProject={currentProject}>
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-10">
            <DetailedPrTitle
              author={pullRequest.createdBy.name}
              title={pullRequest.title}
              prId={pullRequest.prId}
              status={pullRequest.status}
              base="main"
              current="feat/something"
            />
          </div>
          <div className="col-span-2">
            <Button variant="danger-outline" className="float-right">
              <GitPullRequestClosed
                className="mr-2 h-4 w-4 text-red-400"
                strokeWidth={2}
              />
              <span className="text-red-400">Close pull request</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <EnvDiffViewer
              oldCode={oldCode}
              newCode={newCode}
              leftTitle="main"
              rightTitle="feat/additional-security"
            />
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
  const user = session?.user;

  // @ts-ignore
  const { slug: projectSlug, prId } = context.params;
  const project = await Project.findBySlug(projectSlug);
  const projectId = project.id;

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

  const pullRequest = await getSinglePr({ projectId, prId: Number(prId) });

  const projects = access.map((a) => a.project);
  const currentProject = projects.find((p) => p.id === projectId);

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
      pullRequest: JSON.parse(JSON.stringify(pullRequest)),
    },
  };
}
