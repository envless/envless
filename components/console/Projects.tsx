import Link from "next/link";
import { TbGitBranch, TbUserCheck } from "react-icons/tb";
import CreateProjectModal from "@/components/console/CreateProjectModal";

const Projects = ({ ...props }) => {
  const { projects } = props;

  const Card = ({ project }) => {
    return (
      <Link href={`/console/${project.id}`} className="cursor-pointer">
        <div className="w-full rounded-md border-2 border-darker bg-darker p-5 hover:border-teal-300/70">
          <h5
            title={project?.name}
            className="line-clamp-1 text-base font-bold leading-5 text-lightest"
          >
            {project?.name}
          </h5>
          <p className="mt-1 text-xs text-light">Created 2 days ago</p>

          <div className="mt-8 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="inline-block">
                <TbUserCheck className="inline-block h-4 w-4 text-lighter" />
                <span className="ml-2 inline-block">
                  {project._count.roles}
                </span>
              </div>
              <p className="mt-1 text-light">Members</p>
            </div>

            <div>
              <div className="inline-block">
                <TbGitBranch className="inline-block h-4 w-4 text-lighter" />
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
        <h2 className="mb-8 text-2xl font-bold">Projects</h2>
        <div className="absolute right-0">
          <CreateProjectModal />
        </div>
      </div>
      <div className="-mx-4 -mb-4 flex flex-wrap md:mb-0">
        {projects.map((project) => {
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
