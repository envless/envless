import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { User, Project } from "@prisma/client";
import { Nav, Tabs } from "@/components/projects";
import { Container, Hr } from "@/components/theme";

interface ProjectProps {
  tab?: string;
  projects: any;
  currentProject: any;
  children: React.ReactNode;
}

const ProjectLayout = ({
  tab,
  projects,
  children,
  currentProject,
}: ProjectProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "authenticated") {
    return (
      <>
        <Container>
          <Nav
            user={user}
            currentProject={currentProject}
            projects={projects}
          />
        </Container>

        <Tabs projectId={currentProject?.id} active={tab || "project"} />
        <Container>
          <div className="my-10 flex flex-wrap">{children}</div>
        </Container>
      </>
    );
  } else {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-5">
        Loading ...
      </div>
    );
  }
};

export default ProjectLayout;
