import Link from "next/link";
import { AlertCircle, GitBranch, Lock, Users } from "lucide-react";
import DateTimeAgo from "@/components/DateTimeAgo";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../theme";

const Projects = ({ ...props }) => {
  const { projects } = props;

  const sortedProjects = projects.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const Card = ({ project }) => {
    const twoFactorAuth = project.settings.enforce2FA;

    return (
      <>
        <Link href={`/projects/${project.slug}`} className="cursor-pointer">
          <div className="border-darker bg-darker relative w-full rounded-md border-2 p-5 hover:border-teal-300/70">
            {twoFactorAuth && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Lock className="text-lighter absolute right-5 inline-block h-5 w-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex space-x-4">
                      <AlertCircle className="h-6 w-6 shrink-0 text-teal-300" />
                      <p className="text-xs">
                        This project requires two-factor authentication
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <h5
              title={project.name}
              className="line-clamp-1 text-lightest text-base leading-5"
            >
              {project?.name}
            </h5>
            <p className="text-light mt-1 text-xs">
              Created {""}
              <DateTimeAgo date={project.createdAt} />
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8 text-xs">
              <div>
                <div className="inline-block">
                  <Users className="text-lighter inline-block h-5 w-5" />
                  <span className="ml-2 inline-block">
                    {project._count.access}
                  </span>
                </div>
                <p className="text-light mt-1">Members</p>
              </div>

              <div>
                <div className="inline-block">
                  <GitBranch className="text-lighter inline-block h-5 w-5" />
                  <span className="ml-2 inline-block">
                    {project._count.branches}
                  </span>
                </div>
                <p className="text-light mt-1">Branches</p>
              </div>
            </div>
          </div>
        </Link>
      </>
    );
  };

  return (
    <>
      <div className="relative grid grid-cols-2">
        <h2 className="mb-8 text-2xl">Projects</h2>
        <div className="absolute right-0">
          <CreateProjectModal />
        </div>
      </div>
      <div className="-mx-4 -mb-4 flex flex-wrap md:mb-0">
        {sortedProjects.map((project) => {
          return (
            <div className="mb-8 w-1/2 px-4 lg:w-1/3" key={project.id}>
              <Card project={project} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Projects;
