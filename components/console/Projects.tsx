import Link from "next/link";
import { TbGitBranch, TbUserCheck } from "react-icons/tb";
import CreateProjectModal from "@/components/console/CreateProjectModal";


const Projects = ({ ...props }) => {
  const { projects } = props;

  const Card = ({ project }) => {
    return (
      <Link href={`/console/${project.id}`} className="cursor-pointer">
        <div className="border-2 w-full rounded-md border-darker hover:border-teal-300/70 bg-darker p-5">
          <h5
            title={project?.name}
            className="line-clamp-1 text-base font-bold leading-5 text-lightest"
          >
            { project?.name }
          </h5>
          <p className="text-xs text-light mt-1">Updated 2 days ago</p>

          <div className="grid grid-cols-2 gap-8 mt-8 text-xs">
            <div>
              <div className="inline-block">
                <TbUserCheck className="h-4 w-4 text-lighter inline-block" />
                <span className="inline-block ml-2">{project._count.roles}</span>
              </div>
              <p className="mt-1 text-light">Members</p>
            </div>

            <div>
              <div className="inline-block">
                <TbGitBranch className="h-4 w-4 text-lighter inline-block" />
                <span className="inline-block ml-2">{project._count.branches}</span>
              </div>
              <p className="mt-1 text-light">Branches</p>
            </div>
          </div>
        </div>
      </Link>
    )
  };

  return (
    <>
      <div className="grid grid-cols-2 relative">
        <h2 className="text-2xl font-bold mb-8">Projects</h2>
        <div className="right-0 absolute">
          <CreateProjectModal />
        </div>

      </div>
      <div className="flex flex-wrap -mx-4 -mb-4 md:mb-0">
        {
          projects.map((project) => {
            return (
              <div className="w-full w-1/2 lg:w-1/3 px-4 mb-8" key={project.id}>
                <Card project={project} />
              </div>
            )
          })
        }
      </div>
    </>
  );
};

export default Projects;
