import Link from "next/link";
import { GitBranch, Users } from "lucide-react";
import DateTimeAgo from "@/components/DateTimeAgo";
import CreateProjectModal from "@/components/projects/CreateProjectModal";

const Projects = ({ ...props }) => {
  const { projects } = props;

  const sortedProjects = projects.sort((a, b) => {
    // @ts-ignore
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const Card = ({ project }) => {
    return (
      <Link href={`/projects/${project.id}`} className="cursor-pointer">
        <div className="w-full rounded-md border-2 border-black-700 bg-black-800 p-5 hover:border-teal-300/70">
          <h5
            title={project?.name}
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
