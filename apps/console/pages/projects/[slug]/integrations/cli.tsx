import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { withAccessControl } from "@/utils/withAccessControl";
import { MembershipStatus, Project, UserRole } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import CliSetup from "@/components/integrations/CliSetup";
import { Button, SlideOver } from "@/components/theme";
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
        footer={
          <div className="flex flex-shrink-0 justify-end px-4 py-4">
            <Button className="ml-4" onClick={async () => {}}>
              Save and continue
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        }
      >
        <CliSetup currentProject={currentProject} />
      </SlideOver>
    </IntegrationsPage>
  );
};

export const getServerSideProps = withAccessControl({
  hasAccess: {
    roles: [
      UserRole.maintainer,
      UserRole.developer,
      UserRole.guest,
      UserRole.owner,
    ],
    statuses: [MembershipStatus.active],
  },
  withEncryptedProjectKey: false,
});

export default CliIntegration;
