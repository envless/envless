import { type GetServerSidePropsContext } from "next";
import ProjectLayout from "@/layouts/Project";
import { getServerSideSession } from "@/utils/session";
import { Project } from "@prisma/client";
import {
  AWS,
  Docker,
  Fly,
  GCP,
  Github,
  Gitlab,
  Heroku,
  Kubernetes,
  Laraval,
  Netlify,
  NextJs,
  NuxtJs,
  Placeholder,
  Rails,
  Railway,
  Render,
  Supabase,
  Vercel,
} from "@/components/icons/integrations";
import { Button } from "@/components/theme";
import prisma from "@/lib/prisma";

const integrations = [
  {
    name: "Vercel",
    slug: "vercel",
    icon: Vercel,
    category: "Platform as a service",
    isActive: true,
  },
  {
    name: "Supabase",
    slug: "supabase",
    icon: Supabase,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Netlify",
    slug: "netlify",
    icon: Netlify,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Render",
    slug: "render",
    icon: Render,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Fly.io",
    slug: "fly",
    icon: Fly,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Railway",
    slug: "railway",
    icon: Railway,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Heroku",
    slug: "heroku",
    icon: Heroku,
    category: "Platform as a service",
    isActive: true,
  },

  {
    name: "Google Cloud",
    slug: "gcp",
    icon: GCP,
    category: "Infrastructure as a service",
    isActive: true,
  },

  {
    name: "AWS",
    slug: "aws",
    icon: AWS,
    category: "Infrastructure as a service",
    isActive: true,
  },

  {
    name: "GitHub Actions",
    slug: "github",
    icon: Github,
    category: "CI/CD",
    isActive: true,
  },

  {
    name: "Gitlab CI/CD",
    slug: "gitlab",
    icon: Gitlab,
    category: "CI/CD",
    isActive: true,
  },

  {
    name: "Docker",
    slug: "docker",
    icon: Docker,
    category: "Container",
    isActive: true,
  },

  {
    name: "Kubernetes",
    slug: "kubernetes",
    icon: Kubernetes,
    category: "Container",
    isActive: true,
  },

  {
    name: "Rails",
    slug: "rails",
    icon: Rails,
    category: "Framework",
    isActive: true,
  },

  {
    name: "Next.js",
    slug: "nextjs",
    icon: NextJs,
    category: "Framework",
    isActive: true,
  },
  {
    name: "Nuxt.js",
    slug: "nuxtjs",
    icon: NuxtJs,
    category: "Framework",
    isActive: true,
  },
  {
    name: "Laraval",
    slug: "laraval",
    icon: Laraval,
    category: "Framework",
    isActive: true,
  },
  {
    name: "All others",
    slug: "more",
    icon: Placeholder,
    category: "Coming soon...",
    isActive: true,
  },
];

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 */

interface Props {
  projects: Project[];
  currentProject: Project;
}

export const IntegrationsPage = ({ projects, currentProject }: Props) => {
  return (
    <ProjectLayout
      tab="integrations"
      projects={projects}
      currentProject={currentProject}
    >
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        {integrations.map((integration) => (
          <div
            key={integration.slug}
            className="delay-50 w-full cursor-pointer rounded bg-darker p-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 sm:p-6"
          >
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <integration.icon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-lightest">
                  <a href="#" className="hover:underline">
                    {integration.name}
                  </a>
                </p>
                <p className="text-sm text-light">
                  <a href="#" className="hover:underline">
                    {integration.category}
                  </a>
                </p>
              </div>
            </div>
            <Button small={true} secondary={true} className="mt-5">
              Configure
            </Button>
          </div>
        ))}
      </div>
    </ProjectLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSideSession(context);
  const user = session?.user;

  // @ts-ignore
  const { id } = context.params;

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
  const currentProject = projects.find((project) => project.id === id);

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

export default IntegrationsPage;
