import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { withAccessControl } from "@/utils/withAccessControl";
import { Project } from "@prisma/client";
import { Button, SlideOver } from "@/components/theme";
import IntegrationsPage from "./index";

interface Props {
  projects: Project[];
  currentProject: Project;
  projectRole: string;
}

export const CliIntegration = ({
  projects,
  currentProject,
  projectRole,
}: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setOpen(true);
    }
  });

  return (
    <IntegrationsPage
      projects={projects}
      currentProject={currentProject}
      projectRole={projectRole}
    >
      <SlideOver
        size="2xl"
        open={open}
        setOpen={setOpen}
        title="CLI Configuration"
        description="Configure CLI for local development, deployment or CI/CD pipelines."
        onClose={() => {
          setOpen(false);
          router.push(`/projects/${currentProject.slug}/integrations`);
        }}
      >
        <div className="space-y-4">Hello world!</div>
      </SlideOver>
    </IntegrationsPage>
  );
};

export const getServerSideProps = withAccessControl({
  checkProjectOwner: false,
  withEncryptedProjectKey: false,
});

export default CliIntegration;
