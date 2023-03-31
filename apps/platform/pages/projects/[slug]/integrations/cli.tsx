import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { withAccessControl } from "@/utils/withAccessControl";
import { Project, UserRole } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import CliSetup from "@/components/integrations/CliSetup";
import { SlideOver } from "@/components/theme";
import IntegrationsPage from "./index";

interface Props {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
}

export const CliIntegration = ({
  projects,
  currentProject,
  currentRole,
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
      currentRole={currentRole}
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
        submitButtonText="Continue"
        submitButtonIcon={
          <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        }
      >
        <CliSetup currentProject={currentProject} />
      </SlideOver>
    </IntegrationsPage>
  );
};

export const getServerSideProps = withAccessControl({
  hasAccess: { maintainer: true, owner: true, developer: true, guest: true },
  withEncryptedProjectKey: false,
});

export default CliIntegration;
