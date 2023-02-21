import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Tabs } from "@/components/projects";
import { Container, Hr, Nav } from "@/components/theme";

interface Props {
  tab?: string;
  projects: any;
  currentProject: any;
  children: React.ReactNode;
}

const ProjectLayout = ({ tab, projects, children, currentProject }: Props) => {
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
        <Hr />
        <Tabs projectId={currentProject?.id} active={tab || "project"} />

        <Container>
          <div className="my-10 flex flex-wrap">{children}</div>
        </Container>

        <Toaster position="top-right" />
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
