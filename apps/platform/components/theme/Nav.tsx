import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAvatar } from "@/utils/getAvatar";
import Fuse from "fuse.js";
import { Check, ChevronDown, Search } from "lucide-react";
import { signOut } from "next-auth/react";
import { Dropdown, Hr, Logo, Popover, ScrollArea } from "@/components/theme";
import log from "@/lib/log";

const Nav = ({ ...props }) => {
  const router = useRouter();
  const { user, currentProject, projects, layout } = props;

  const [projectList, setProjectList] = useState(projects);

  useEffect(() => {
    setProjectList(projects);
  }, [projects]);

  const avatar = getAvatar(user);

  const menuItems = [
    {
      title: "Settings",
      handleClick: () => router.push("/settings"),
    },
    {
      title: "Documentation",
      handleClick: () => log("Docs"),
    },
    {
      title: "Changelog",
      handleClick: () => log("Changelog"),
    },
    {
      title: "Sign out",
      handleClick: () => signOut(),
    },
  ];

  const handleSearch = (e: any) => {
    const query = e.target.value;
    if (!query) {
      setProjectList(projects);
    } else {
      const fuse = new Fuse(projects, {
        keys: ["name"],
      });

      const results = fuse.search(query);
      const items = results.map((result) => result.item);
      setProjectList(items);
    }
  };

  return (
    <nav className="mx-auto flex flex-wrap items-center justify-between py-6 lg:justify-between">
      <div className="flex w-auto flex-wrap items-center justify-between">
        <Link href="/projects">
          <Logo />
        </Link>

        {layout && <h2 className="ml-5">{layout}</h2>}

        {currentProject && (
          <Popover
            zIndex={40}
            button={
              <div className="ml-5 cursor-pointer hover:text-teal-300">
                <div className="absolute -right-7 hover:text-teal-300">
                  <ChevronDown />
                </div>

                <h3 className="text-md text-bold hover:text-teal-300">
                  {currentProject.name}
                </h3>
              </div>
            }
          >
            <div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="text-light h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full border-none bg-transparent pl-10 text-sm focus:outline-none focus:ring-0"
                  placeholder="Search projects"
                  onChange={handleSearch}
                />
                <Hr />
              </div>

              <ScrollArea className="h-72">
                <div className="p-3 text-sm">
                  <ul className="">
                    {projectList.map((project) => (
                      <Link
                        className=""
                        href={`/projects/${project.slug}`}
                        key={project.id}
                      >
                        <li
                          key={project.id}
                          className="hover:bg-dark px-3 py-2"
                        >
                          {project.name}

                          {project.id === currentProject.id && (
                            <Check
                              className="float-right h-4 w-4 text-teal-300"
                              aria-hidden="true"
                            />
                          )}
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
            </div>
          </Popover>
        )}
      </div>

      <div className="flex items-center text-center">
        <Dropdown
          button={
            <Image
              className="cursor-pointer rounded-full"
              src={avatar}
              alt="avatar"
              height={40}
              width={40}
            />
          }
          items={menuItems}
        />
      </div>
    </nav>
  );
};

export default Nav;
