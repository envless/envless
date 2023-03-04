import { useEffect, useState } from "react";
import useFuse from "@/hooks/useFuse";
import { UserType } from "@/types/resources";
import clsx from "clsx";
import { Lock, Settings2, Unlock, UserX } from "lucide-react";
import MemberTabs from "@/components/members/MemberTabs";
import BaseEmptyState from "@/components/theme/BaseEmptyState";

interface TableProps {
  tab: string;
  setTab: (tab: "active" | "pending" | "inactive") => void;
  members: UserType[];
}

const MembersTable = ({ members, tab, setTab }: TableProps) => {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState(members);
  const fuseOptions = { keys: ["name", "email"], threshold: 0.2 };
  const results = useFuse(members, query, fuseOptions);

  useEffect(() => {
    if (query.length === 0) {
      setTeam(members);
    } else {
      const collection = results.map((result) => result.item);
      setTeam(collection);
    }
  }, [query]);

  return (
    <>
      <MemberTabs tab={tab} setTab={setTab} setQuery={setQuery} />

      {team.length === 0 ? (
        <BaseEmptyState
          icon={<UserX className="mx-auto mb-3 h-10 w-10" />}
          title="Members not found"
          subtitle="You can invite team member by clicking on the 'Invite team member' button."
        />
      ) : (
        <table className="min-w-full divide-y divide-dark">
          <tbody className=" bg-dark">
            {team.map((member) => (
              <tr key={member.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={member.image}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium ">{member.name}</div>
                      <div
                        className={clsx(
                          tab === "pending" ? "text-medium" : "text-light",
                        )}
                      >
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="mt-3 py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                  {member.role}
                </td>

                {tab != "pending" && (
                  <td className="mt-3 hidden py-4 pl-3 pr-4 text-sm font-medium sm:pr-6 md:block">
                    <div className="inline-flex">
                      2FA
                      {member.twoFactorEnabled ? (
                        <Lock className="ml-2 h-4 w-4 text-teal-400" />
                      ) : (
                        <Unlock className="ml-2 h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </td>
                )}

                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <a href="#" className="hover:text-teal-400">
                    <Settings2
                      className="float-right h-5 w-5"
                      strokeWidth={2}
                    />
                    <span className="sr-only">, {member.name}</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default MembersTable;
