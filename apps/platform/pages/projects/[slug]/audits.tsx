import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import ProjectLayout from "@/layouts/Project";
import { withAccessControl } from "@/utils/withAccessControl";
import { Project, UserRole } from "@prisma/client";
import { Columns, Filter, Search } from "lucide-react";
import { BaseInput, Button } from "@/components/theme";

/**
 * A functional component that represents a project.
 * @param {Props} props - The props for the component.
 * @param {Projects} props.projects - The projects the user has access to.
 * @param {currentProject} props.currentProject - The current project.
 * @param {currentRole} props.currentRole - The user role in current project.
 */

interface Props {
  projects: Project[];
  currentProject: Project;
  currentRole: UserRole;
  auditLogs: any;
}

export const AuditLogsPage = ({
  projects,
  currentProject,
  currentRole,
  auditLogs,
}: Props) => {
  return (
    <ProjectLayout
      tab="audits"
      projects={projects}
      currentRole={currentRole}
      currentProject={currentProject}
    >
      <div className="border-dark mt-12 w-full overflow-x-auto rounded-md border-2 shadow-sm">
        <div className="flex items-center justify-end py-2 px-2 font-medium">
          <div className="flex w-full items-center justify-end gap-2 md:max-w-md">
            <div className="flex flex-1 justify-end">
              <div className="relative w-full group">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-light group-focus-within:text-lighter">
                  <Search className="h-4 w-4" />
                </div>

                <BaseInput
                  placeholder="Search"
                  className="w-full max-w-xs py-1.5 !pl-9"
                  full={false}
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center">
              <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/25">
                <Filter className="h-5 w-5" />
              </button>
            </div>

            <div className="flex shrink-0 items-center">
              <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/25">
                <Columns className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <table className="w-full table-auto border-b-2 text-left text-sm">
          <thead className="border-dark border-b-2">
            <tr>
              <th className="py-3 px-6 text-sm font-medium">Created By</th>
              <th className="py-3 px-6 text-sm font-normal">Action Performed</th>
              <th className="py-3 px-6 text-sm font-normal">Project</th>
              <th className="py-3 px-6 text-sm font-normal">Created At</th>
              <th className="py-3 text-sm px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-dark divide-y bg-darker">
            {auditLogs.map((item, idx) => (
              <tr key={idx}>
                <td className="flex items-center gap-x-3 whitespace-nowrap py-3 px-6">
                  <img src={item.avatar} className="w-10 h-10 rounded-full" />
                  <div>
                    <span className="block text-xs">{item.createdBy}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap rounded-md px-6 py-4 ">
                  <span className="border-dark rounded-xl border px-2 py-0.5 tracking-tight uppercase text-emerald-200 font-normal">
                    {item.action}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{item.project}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {item.createdAt}
                </td>
                <td className="whitespace-nowrap px-6 text-right">
                  <a
                    href="#"
                    className="py-2 px-3 font-medium text-teal-400 duration-150 hover:text-teal-300 hover:underline"
                  >
                    Detail
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between py-2 px-2 font-medium">
          <p className="text-xs">100 items</p>
          <div className="flex items-center gap-4">
            <Link className="text-xs text-teal-400" href="/">
              Prev
            </Link>
            <div>
              <span className="block text-xs">Page 1 of 3</span>
            </div>
            <Link className="text-xs text-teal-400" href="/">
              Next
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <p>Per Page</p>
            <select className="input-primary text-xs">
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>40</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

const _getServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: {
      auditLogs: [
        {
          id: 1,
          name: "audit log 1",
          createdAt: "Mar 27, 2023, 6:24 AM",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",
          avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "Mar 27, 2023 6:24 AM",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",
          avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "Mar 27, 2023, 6:24 AM",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",
          avatar: "https://i.pravatar.cc/150?img=3"

        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "Mar 27, 2023, 6:24 AM",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",

          avatar: "https://i.pravatar.cc/150?img=3"

        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "2021-01-01",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",

          avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "2021-01-01",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",

          avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "2021-01-01",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",

          avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "2021-01-01",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",

          avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "2021-01-01",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",

          avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "2021-01-01",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",

          avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "2021-01-01",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",

          avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
          id: 1,
          name: "audit log 1",
          createdAt: "2021-01-01",
          createdBy: "Chetan Kharel",
          action: "access.created",
          project: "Untitled X",

          avatar: "https://i.pravatar.cc/150?img=3"
        },
      ],
    },
  };
};

export const getServerSideProps = withAccessControl({
  hasAccess: { maintainer: true, developer: true, guest: true, owner: true },
  getServerSideProps: _getServerSideProps,
});

export default AuditLogsPage;
