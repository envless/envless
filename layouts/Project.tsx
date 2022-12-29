import { useSession } from "next-auth/react";
import { Nav, Tabs } from "@/components/projects";
import { Container } from "@/components/theme";

interface Props {
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
}: Props) => {
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
