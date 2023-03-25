import Link from "next/link";
import { GitBranch, ShieldAlert, Users } from "lucide-react";
import DateTimeAgo from "@/components/DateTimeAgo";
import { LockIcon } from "@/components/icons";
import CreateProjectModal from "@/components/projects/CreateProjectModal";

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
          <div className="border-darker bg-darker w-full  rounded-md border-2  p-5 transition duration-300 hover:border-teal-300/70">
            <div className="flex justify-between gap-2">
              <div>
                <h5
                  title={project.name}
                  className="line-clamp-1 text-lightest max-w-[150px] truncate text-base leading-5"
                >
                  {project?.name}
                </h5>
                <p className="text-light mt-1 text-xs">
                  Created {""}
                  <DateTimeAgo date={project.createdAt} />
                </p>
              </div>

              <div>
                {project.deletedAt ? (
                  <button
                    aria-label="You have deleted this project. Click to restore it."
                    data-balloon-pos="up"
                    className="rounded-full p-2 text-white transition duration-200 hover:bg-white/25"
                  >
                    <ShieldAlert className="h-5 w-5 shrink-0 text-red-600" />
                  </button>
                ) : (
                  twoFactorAuth && (
                    <button
                      aria-label="This project requires two-factor authentication"
                      data-balloon-pos="up"
                      className="rounded-full p-2 text-white transition duration-200 hover:bg-white/25"
                    >
                      <LockIcon className="h-5 w-5 shrink-0 text-teal-300" />
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-8 text-xs">
              <div className="flex flex-col justify-center">
                <div className="inline-block">
                  <Users className="text-lighter inline-block h-4 w-4" />
                  <span className="ml-2 inline-block">
                    {project._count.access}
                  </span>
                </div>
                <p className="text-light mt-1">Members</p>
              </div>

              <div className="flex flex-col justify-center">
                <div className="inline-block">
                  <GitBranch className="text-lighter inline-block h-4 w-4 shrink-0" />
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
