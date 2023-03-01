import Link from "next/link";
import { GitBranch, Lock, Users } from "lucide-react";
import DateTimeAgo from "@/components/DateTimeAgo";
import CreateProjectModal from "@/components/projects/CreateProjectModal";

const Projects = ({ ...props }) => {
  const { projects } = props;

  const sortedProjects = projects.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const Card = ({ project }) => {
    const twoFactorAuth = project.projectSettings[0].enforce_2fa_for_all_users;

    return (
      <Link href={`/projects/${project.id}`} className="cursor-pointer">
        <div className="relative w-full rounded-md border-2 border-darker bg-darker p-5 hover:border-teal-300/70">
          {twoFactorAuth && (
            <Lock className="absolute right-5 inline-block h-5 w-5 text-lighter" />
          )}
          <h5
            title={project.name}
            className="line-clamp-1 text-base leading-5 text-lightest"
          >
            {project?.name}
          </h5>
          <p className="mt-1 text-xs text-light">
            Created {""}
            <DateTimeAgo date={project.createdAt} />
          </p>
          <div className="mt-8 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="inline-block">
                <Users className="inline-block h-5 w-5 text-lighter" />
                <span className="ml-2 inline-block">
                  {project._count.access}
                </span>
              </div>
              <p className="mt-1 text-light">Members</p>
            </div>

            <div>
              <div className="inline-block">
                <GitBranch className="inline-block h-5 w-5 text-lighter" />
                <span className="ml-2 inline-block">
                  {project._count.branches}
                </span>
              </div>
              <p className="mt-1 text-light">Branches</p>
            </div>
          </div>
        </div>
      </Link>
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
            <div className="mb-8 w-full w-1/2 px-4 lg:w-1/3" key={project.id}>
              <Card project={project} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Projects;
