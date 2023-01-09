import Fuse from "fuse.js";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Dropdown from "@/components/theme/Dropdown";
import { Logo, Popover, Hr } from "@/components/theme";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/20/solid";

const Nav = ({ ...props }) => {
  const router = useRouter();
  const { user, currentProject, projects, layout } = props;
  const [projectList, setProjectList] = useState(projects);
  const { name, email, image } = user;
  const initials = name
    ? name
        .split(" ")
        .map((n: String) => n[0])
        .join("")
        .toUpperCase()
    : email.slice(0, 2).toUpperCase();
  const avatar =
    image || `https://avatar.vercel.sh/${initials}.svg?text=${initials}`;

  const menuItems = [
    {
      title: "Settings",
      handleClick: () => router.push("/settings"),
    },
    {
      title: "Documentation",
      handleClick: () => console.log("Docs"),
    },
    {
      title: "Changelog",
      handleClick: () => console.log("Changelog"),
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
            button={
              <div className="ml-5 cursor-pointer hover:text-teal-300">
                <div className="absolute -right-7 top-[2px] hover:text-teal-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="text-ligher h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                    />
                  </svg>
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
                  <MagnifyingGlassIcon
                    className="h-4 w-4 text-light"
                    aria-hidden="true"
                  />
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

              <div className="p-3 text-sm">
                <ul className="">
                  {projectList.map((project) => (
                    <Link
                      className=""
                      href={`/projects/${project.id}`}
                      key={project.id}
                    >
                      <li key={project.id} className="px-3 py-2 hover:bg-dark">
                        {project.name}

                        {project.id === currentProject.id && (
                          <CheckIcon
                            className="float-right h-4 w-4 text-teal-300"
                            aria-hidden="true"
                          />
                        )}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
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
