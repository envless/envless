import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import useFuse from "@/hooks/useFuse";
import { MemberType, UserType } from "@/types/resources";
import { downloadAsTextFile } from "@/utils/helpers";
import { trpc } from "@/utils/trpc";
import { MembershipStatus, UserRole } from "@prisma/client";
import { PaginationState } from "@tanstack/react-table";
import { Download, Search, UserX } from "lucide-react";
import * as csvParser from "papaparse";
import BaseEmptyState from "@/components/theme/BaseEmptyState";
import { BaseInput } from "../theme";
import { showToast } from "../theme/showToast";
import PaginatedMembersTable from "./PaginatedMembersTable";

interface TableProps {
  members: MemberType[];
  totalMembers: number;
  pageCount: number;
  currentRole: UserRole;
  projectId: string;
  user: UserType;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  refetchMembersAfterUpdate: (...args: any[]) => any;
}

interface SelectedMember {
  userId: string;
  newRole: UserRole;
  currentRole: UserRole;
}

const MembersTableContainer = ({
  members,
  currentRole,
  projectId,
  totalMembers,
  pageCount,
  pagination,
  setPagination,
  user,
  refetchMembersAfterUpdate,
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

  const memberStatusMutation = trpc.members.updateUserAccessStatus.useMutation({
    onSuccess: (data) => {
      showToast({
        type: "success",
        title: "Access successfully updated",
        subtitle: "",
      });
      setFetching(false);
      router.replace(router.asPath);
      refetchMembersAfterUpdate();
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
      refetchMembersAfterUpdate();
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
      refetchMembersAfterUpdate();
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
      refetchMembersAfterUpdate();
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
    (user: SelectedMember, status: MembershipStatus) => {
      const confirmed = confirm(
        `Are you sure you want to ${
          status === MembershipStatus.active ? "re-activate" : "de-activate"
        } change this user?`,
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

  return (
    <div className="border-dark mt-12 w-full rounded-md border-2 shadow-sm">
      <div className="border-dark flex items-center justify-between border-b px-2 py-2 font-medium">
        <div className="flex w-full flex-col items-start justify-between gap-2 px-4 sm:flex-row sm:items-center">
          <div className="group relative w-full">
            <div className="text-light group-focus-within:text-lighter pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
              <Search className="h-4 w-4" />
            </div>
            <BaseInput
              placeholder="Search members..."
              type="text"
              className="w-full py-1.5  !pl-9 sm:max-w-xs"
              onChange={(e) => setQuery(e.target.value)}
              full={false}
            />
          </div>
          <div className="flex shrink-0 items-center">
            <button
              aria-label="Download as CSV"
              data-balloon-pos="up"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/25"
              onClick={() => {
                const dataForCSV = team.map((team) => {
                  return {
                    name: team.name,
                    email: team.email,
                    role: team.role,
                  };
                });

                const csv = csvParser.unparse(dataForCSV);
                downloadAsTextFile("members-data.csv", csv);
              }}
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full min-w-full">
        {team.length === 0 ? (
          <BaseEmptyState
            icon={<UserX className="mx-auto mb-3 h-10 w-10" />}
            title="Members not found"
            subtitle="You can invite team member by clicking on the 'Invite team member' button."
          />
        ) : (
          <PaginatedMembersTable
            members={team}
            setFetching={setFetching}
            totalMembers={totalMembers}
            pagination={pagination}
            setPagination={setPagination}
            handleUpdateMemberAccess={onUpdateMemberAccess}
            handleUpdateMemberStatus={onUpdateMemberStatus}
            memberReinviteMutation={memberReinviteMutation}
            memberDeleteInviteMutation={memberDeleteInviteMutation}
            fetching={fetching}
            currentRole={currentRole}
            projectId={projectId}
            pageCount={pageCount}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default MembersTableContainer;
