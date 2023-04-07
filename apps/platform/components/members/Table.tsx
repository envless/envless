import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import React from "react";
import useFuse from "@/hooks/useFuse";
import type { PendingInvite } from "@/pages/projects/[slug]/members";
import { UserType } from "@/types/resources";
import { trpc } from "@/utils/trpc";
import { UserRole } from "@prisma/client";
import clsx from "clsx";
import {
  Lock,
  MailCheck,
  RotateCwIcon,
  Trash,
  Unlock,
  UserCog,
  UserX,
} from "lucide-react";
import MemberTabs from "@/components/members/MemberTabs";
import BaseEmptyState from "@/components/theme/BaseEmptyState";
import { showToast } from "../theme/showToast";
import MemberDropDown from "./MemberDropDown";

export type Tab = "active" | "pending" | "inactive";

interface TableProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
  members: UserType[];
  currentRole: UserRole;
  projectId: string;
  user: UserType;
}

interface SelectedMember {
  userId: string;
  newRole: UserRole;
  currentRole: UserRole;
}
const roles: UserRole[] = Object.values(UserRole);

function hasExpired(invite: PendingInvite) {
  const now = Date.now();
  const inviteTime = new Date(invite.invitationTokenExpiresAt).getTime();
  return now > inviteTime;
}

const MembersTable = ({
  members,
  tab,
  setTab,
  currentRole,
  projectId,
  user,
}: TableProps) => {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState(members);
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
  const memberUpdateMutation = trpc.members.update.useMutation({
    onSuccess: (data) => {
      showToast({
        type: "success",
        title: "Access successfully updated",
        subtitle: "",
      });
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

  const memberReinviteMutation = trpc.members.reInvite.useMutation({
    onSuccess: (data) => {
      setFetching(false);
      router.replace(router.asPath);
      showToast({
        type: "success",
        title: "Invitation sent",
        subtitle: "You have succefully sent an invitation.",
      });
    },
    onError: (error) => {
      setFetching(false);
      showToast({
        type: "error",
        title: "Invitation not sent",
        subtitle: error.message,
      });
    },
  });

  const memberDeleteInviteMutation = trpc.members.deleteInvite.useMutation({
    onSuccess: (data) => {
      setFetching(false);
      router.replace(router.asPath);
      showToast({
        type: "success",
        title: "Invitation deleted",
        subtitle: "The invitation has been successfully deleted.",
      });
    },
    onError: (error) => {
      setFetching(false);
      showToast({
        type: "error",
        title: "Error deleting invitation",
        subtitle:
          "An error occurred while deleting the invitation. Please try again later.",
      });
    },
  });

  const onUpdateMemberAccess = useCallback(
    (user: SelectedMember) => {
      setFetching(true);

      memberUpdateMutation.mutate({
        projectId,
        newRole: user.newRole,
        currentUserRole: currentRole,
        targetUserId: user.userId,
        targetUserRole: user.currentRole,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId, currentRole],
  );

  const onUpdateMemberStatus = useCallback(
    (user: SelectedMember, status: boolean) => {
      const confirmed = confirm(
        "Are you sure you want to change this user's status?",
      );
      if (confirmed) {
        setFetching(true);
        memberStatusMutation.mutate({
          projectId,
          status,
          currentUserRole: currentRole,
          targetUserId: user.userId,
          targetUserRole: user.currentRole,
        });
      }
    },
    [memberStatusMutation, projectId, currentRole],
  );

  const handleReInvite = async (email: string) => {
    setFetching(true);
    memberReinviteMutation.mutate({
      email,
      projectId,
    });
  };
  const handleDeleteInvite = (email: string) => {
    setFetching(true);
    memberDeleteInviteMutation.mutate({
      email,
      projectId,
    });
  };

  const renderSettingsButton = (member: UserType) => {
    if (tab === "pending") {
      const invite = member as PendingInvite;

      return (
        <button
          onClick={
            hasExpired(invite)
              ? () => {
                  handleReInvite(invite.email);
                }
              : () => {
                  handleDeleteInvite(invite.email);
                }
          }
          aria-label={hasExpired(invite) ? "Re-invite member" : "Delete invite"}
          data-balloon-pos="up"
          className="hover:text-teal-400 hover:disabled:text-current"
          disabled={fetching || invite.id === user.id}
        >
          {hasExpired(invite) ? (
            <Fragment>
              <MailCheck className="h-5 w-5" strokeWidth={2} />
              <span className="sr-only">Re-invite {invite.email}</span>
            </Fragment>
          ) : (
            <Fragment>
              <Trash className="h-5 w-5" strokeWidth={2} />
              <span className="sr-only">Delete invite for {invite.email}</span>
            </Fragment>
          )}
        </button>
      );
    }

    if (tab === "inactive") {
      return (
        <button
          onClick={() =>
            onUpdateMemberStatus(
              {
                currentRole: member.role,
                newRole: member.role,
                userId: member.id,
              },
              true,
            )
          }
          aria-label={`Re-activate ${member.name}`}
          data-balloon-pos="up"
          className="hover:text-teal-400 hover:disabled:text-current"
          disabled={fetching}
        >
          <Fragment>
            <RotateCwIcon className="h-5 w-5" strokeWidth={2} />
            <span className="sr-only">Re-activate {member?.name}</span>
          </Fragment>
        </button>
      );
    }
    return (
      <button
        onClick={() =>
          onUpdateMemberStatus(
            {
              currentRole: member.role,
              newRole: member.role,
              userId: member.id,
            },
            false,
          )
        }
        className="hover:text-teal-400 disabled:opacity-50 hover:disabled:text-current"
        disabled={
          fetching ||
          member.id === user.id ||
          (currentRole === UserRole.maintainer &&
            member.role === UserRole.owner)
        }
      >
        <Trash className="float-right h-5 w-5" strokeWidth={2} />
        <span className="sr-only">, {member.name}</span>
      </button>
    );
  };

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
        <table className="divide-dark min-w-full divide-y">
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

                {tab === "pending" || tab === "inactive" ? (
                  <td className="relative mt-4 inline-block w-full max-w-[200px]">
                    <div className="w-full">
                      <div className="border-dark bg-dark inline-flex w-full items-center justify-center truncate rounded border px-3 py-2 text-sm">
                        <div className="flex items-center">
                          <UserCog className="mr-2 h-4 w-4 shrink-0" />
                          <span className="text-light mr-2 block text-xs">
                            Role
                          </span>
                        </div>
                        <span className="max-w-[100px] truncate text-sm font-semibold">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </td>
                ) : (
                  <td className="mt-3 py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
                    <MemberDropDown
                      roles={roles}
                      setSelectedRole={(role) =>
                        onUpdateMemberAccess({
                          currentRole: member.role,
                          newRole: role,
                          userId: member.id,
                        })
                      }
                      selectedRole={member.role}
                      disabled={fetching}
                    />
                  </td>
                )}
                {tab != "pending" && tab !== "inactive" && (
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
                  {renderSettingsButton(member)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
};

export default MembersTable;
