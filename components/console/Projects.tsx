import { TbGitBranch, TbUserCheck } from "react-icons/tb";
import { PlusIcon } from '@heroicons/react/20/solid'
import { Button, Modal } from "@/components/theme";
import CreateProjectModal from "@/components/console/CreateProjectModal";


const Projects = ({ ...props }) => {
  const { projects } = props;

  const Card = ({ project }) => {
    return (
      <div className="border-2 w-full rounded-md border-darker hover:border-teal-300/70 bg-darker p-5 cursor-pointer">
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
              <span className="inline-block ml-2">3</span>
            </div>
            <p className="mt-1 text-light">Team</p>
          </div>

          <div>
            <div className="inline-block">
              <TbGitBranch className="h-4 w-4 text-lighter inline-block" />
              <span className="inline-block ml-2">10</span>
            </div>
            <p className="mt-1 text-light">Branches</p>
          </div>
        </div>
      </div>
    )
  };

  return (
    <>
      <div className="grid grid-cols-2">
        <h2 className="text-2xl font-bold mb-8">Projects</h2>
        <div>
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
