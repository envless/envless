import { Fragment } from "react";
import type { Project, UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Tabs } from "@/components/projects";
import { Container, Nav } from "@/components/theme";

interface Props {
  tab?: string;
  projects: Project[];
  currentProject: Project;
  roleInCurrentProject: UserRole;
  children: React.ReactNode;
}

const ProjectLayout = ({
  tab,
  projects,
  children,
  currentProject,
  roleInCurrentProject,
}: Props) => {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "authenticated") {
    return (
      <Fragment>
        <Container>
          <Nav
            user={user}
            currentProject={currentProject}
            projects={projects}
          />
        </Container>
        <Tabs
          roleInCurrentProject={roleInCurrentProject}
          projectSlug={currentProject?.slug}
          active={tab || "project"}
        />

        <Container>
          <div className="my-10 flex flex-wrap">{children}</div>
        </Container>

        <Toaster position="top-right" />
      </Fragment>
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
