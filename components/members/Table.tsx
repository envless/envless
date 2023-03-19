import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import React from "react";
import useFuse from "@/hooks/useFuse";
import { UserType } from "@/types/resources";
import { trpc } from "@/utils/trpc";
import { Access, UserRole } from "@prisma/client";
import clsx from "clsx";
import { Lock, Settings2, Unlock, UserX } from "lucide-react";
import MemberTabs from "@/components/members/MemberTabs";
import BaseEmptyState from "@/components/theme/BaseEmptyState";
import BaseModal from "../theme/BaseModal";
import { showToast } from "../theme/showToast";
import MemberDropDown from "./MemberDropDown";

export type Tab = "active" | "pending" | "inactive";

interface TableProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
  members: UserType[];
  userAccessInCurrentProject: Access;
  projectId: string;
  user: UserType;
}

interface ActiveUser {
  userId: string;
  newRole: UserRole;
  currentRole: UserRole;
}
const defaultRoles: UserRole[] = Object.values(UserRole);

const MembersTable = ({
  members,
  tab,
  setTab,
  userAccessInCurrentProject: userAccess,
  projectId,
  user,
}: TableProps) => {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState(members);
  const [roles, setRoles] = useState(defaultRoles);
  const [selectedMember, setSelectedMember] = useState<ActiveUser | null>(null);
  const [fetching, setFetching] = useState(false);

  const fuseOptions = { keys: ["name", "email"], threshold: 0.2 };
  const results = useFuse(members, query, fuseOptions);
  const router = useRouter();

  useEffect(() => {
    if (query.length === 0) {
      setTeam(members);
    } else {
      const collection = results.map((result) => result.item);
      setTeam(collection);
    }
  }, [members, query, results]);

  const memberStatusMutation = trpc.members.updateActiveStatus.useMutation({
    onSuccess: (data) => {
      showToast({
        type: "success",
        title: "Access successfully updated",
        subtitle: "",
      });
      setSelectedMember(null);
      setFetching(false);
      router.replace(router.asPath);
    },
    onError: (error) => {
      showToast({
        type: "error",
        title: "Access update failed",
        subtitle: error.message,
      });
      setFetching(false);
    },
  });
  const memeberUpdateMutation = trpc.members.update.useMutation({
    onSuccess: (data) => {
      showToast({
        type: "success",
        title: "Access successfully updated",
        subtitle: "",
      });
      setSelectedMember(null);
      setFetching(false);
      router.replace(router.asPath);
    },
    onError: (error) => {
      showToast({
        type: "error",
        title: "Access update failed",
        subtitle: error.message,
      });
      setFetching(false);
    },
  });

  const onUpdateMemberAccess = useCallback(() => {
    if (selectedMember) {
      setFetching(true);

      memeberUpdateMutation.mutate({
        projectId,
        newRole: selectedMember.newRole,
        currentUserRole: userAccess.role,
        targetUserId: selectedMember.userId,
        targetUserRole: selectedMember.currentRole,
      });
    }
  }, [selectedMember, memeberUpdateMutation, projectId, userAccess.role]);

  const onUpdateMemberStatus = useCallback(
    (user: ActiveUser, status: boolean) => {
      setFetching(true);
      memberStatusMutation.mutate({
        projectId,
        status,
        currentUserRole: userAccess.role,
        targetUserId: user.userId,
        targetUserRole: user.currentRole,
      });
    },
    [memberStatusMutation, projectId, userAccess.role],
  );

  return (
    <React.Fragment>
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
                  <button
                    onClick={() =>
                      setSelectedMember({
                        userId: member.id,
                        newRole: member.role,
                        currentRole: member.role,
                      })
                    }
                    className="disabled:opacity-50 hover:text-teal-400 hover:disabled:text-current"
                    disabled={
                      !(
                        userAccess.role === UserRole.owner ||
                        userAccess.role === UserRole.maintainer
                      ) ||
                      member.id === user.id ||
                      (userAccess.role === UserRole.maintainer &&
                        member.role === UserRole.owner)
                    }
                  >
                    <Settings2
                      className="float-right h-5 w-5"
                      strokeWidth={2}
                    />
                    <span className="sr-only">, {member.name}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <BaseModal
        isOpen={selectedMember !== null}
        setIsOpen={() => setSelectedMember(null)}
        title={"Update Member"}
      >
        {selectedMember && (
          <Fragment>
            <MemberDropDown
              roles={roles}
              setSelectedRole={(role) =>
                setSelectedMember((prev) =>
                  prev
                    ? {
                        ...prev,
                        newRole: role,
                      }
                    : null,
                )
              }
              selectedRole={selectedMember.newRole}
              setRoles={setRoles}
              onClickSave={onUpdateMemberAccess}
              onClickRemove={(status) => {
                onUpdateMemberStatus(selectedMember, status);
              }}
              loading={fetching}
              tab={tab}
            />
          </Fragment>
        )}
      </BaseModal>
    </React.Fragment>
  );
};

export default MembersTable;
