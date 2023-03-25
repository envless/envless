import ProjectLayout from "@/layouts/Project";
import { withAccessControl } from "@/utils/withAccessControl";
import type { Project, UserRole } from "@prisma/client";
import {
  AWSIcon,
  DockerIcon,
  FlyIcon,
  GCPIcon,
  GithubIcon,
  GitlabIcon,
  HerokuIcon,
  KubernetesIcon,
  LaravalIcon,
  NetlifyIcon,
  NextJsIcon,
  NuxtJsIcon,
  PlaceholderIcon,
  RailsIcon,
  RailwayIcon,
  RenderIcon,
  SupabaseIcon,
  VercelIcon,
} from "@/components/icons/integrations";
import { Button } from "@/components/theme";

const integrations = [
  {
    name: "Vercel",
    slug: "vercel",
    icon: VercelIcon,
    category: "Platform as a service",
    isActive: true,
  },
  {
    name: "Supabase",
    slug: "supabase",
    icon: SupabaseIcon,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Netlify",
    slug: "netlify",
    icon: NetlifyIcon,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Render",
    slug: "render",
    icon: RenderIcon,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Fly.io",
    slug: "fly",
    icon: FlyIcon,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Railway",
    slug: "railway",
    icon: RailwayIcon,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Heroku",
    slug: "heroku",
    icon: HerokuIcon,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Google Cloud",
    slug: "gcp",
    icon: GCPIcon,
    category: "Infrastructure as a service",
    isActive: true,
  },

  {
    name: "AWS",
    slug: "aws",
    icon: AWSIcon,
    category: "Infrastructure as a service",
    isActive: true,
  },

  {
    name: "GitHub Actions",
    slug: "github",
    icon: GithubIcon,
    category: "CI/CD",
    isActive: true,
  },

  {
    name: "Gitlab CI/CD",
    slug: "gitlab",
    icon: GitlabIcon,
    category: "CI/CD",
    isActive: true,
  },

  {
    name: "Docker",
    slug: "docker",
    icon: DockerIcon,
    category: "Container",
    isActive: true,
  },

  {
    name: "Kubernetes",
    slug: "kubernetes",
    icon: KubernetesIcon,
    category: "Container",
    isActive: true,
  },

  {
    name: "Rails",
    slug: "rails",
    icon: RailsIcon,
    category: "Framework",
    isActive: true,
  },

  {
    name: "Next.js",
    slug: "nextjs",
    icon: NextJsIcon,
    category: "Framework",
    isActive: true,
  },
  {
    name: "Nuxt.js",
    slug: "nuxtjs",
    icon: NuxtJsIcon,
    category: "Framework",
    isActive: true,
  },
  {
    name: "Laraval",
    slug: "laraval",
    icon: LaravalIcon,
    category: "Framework",
    isActive: true,
  },
  {
    name: "All others",
    slug: "more",
    icon: PlaceholderIcon,
    category: "Coming soon...",
    isActive: true,
  },
];

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {currentRole} props.currentRole - The user role in current project.
 */

interface Props {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
}

export const IntegrationsPage = ({
  projects,
  currentProject,
  currentRole,
}: Props) => {
  return (
    <ProjectLayout
      tab="integrations"
      projects={projects}
      currentProject={currentProject}
      currentRole={currentRole}
    >
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        {integrations.map((integration) => (
          <div
            key={integration.slug}
            className="delay-50 bg-darker w-full cursor-pointer rounded p-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 sm:p-6"
          >
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <integration.icon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <p className="text-lightest text-sm font-medium">
                  <a href="#" className="hover:underline">
                    {integration.name}
                  </a>
                </p>
                <p className="text-light text-sm">
                  <a href="#" className="hover:underline">
                    {integration.category}
                  </a>
                </p>
              </div>
            </div>
            <Button size="sm" variant="secondary" className="mt-5">
              Configure
            </Button>
          </div>
        ))}
      </div>
    </ProjectLayout>
  );
};

export const getServerSideProps = withAccessControl({
  hasAccess: { maintainer: true, owner: true, developer: true, guest: true },
});

export default IntegrationsPage;
