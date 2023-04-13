import Image from "next/image";
import React, { Fragment, useCallback, useMemo } from "react";
import type { MemberType, UserType } from "@/types/resources";
import { getAvatar } from "@/utils/getAvatar";
import { MembershipStatus, UserRole } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";
import {
  type ColumnDef,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  Lock,
  MoreVertical,
  Unlock,
} from "lucide-react";
import { Dropdown } from "../theme";
import MemberDropDown from "./MemberDropDown";

type PaginatedMembersTableProps = {
  members: MemberType[];
  pagination: PaginationState;
  handleUpdateMemberAccess: (user: any) => void;
  handleUpdateMemberStatus: (...user: any[]) => void;
  fetching: boolean;
  setFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  memberReinviteMutation: UseMutationResult;
  memberDeleteInviteMutation: UseMutationResult;
  projectId: string;
  currentRole: UserRole;
  totalMembers: number;
  pageCount: number;
  user: UserType;
};

function hasExpired(timeString?: Date) {
  if (!timeString) {
    return false;
  }

  const now = Date.now();
  const inviteTime = new Date(timeString).getTime();

  return now > inviteTime;
}

const roles: UserRole[] = Object.values(UserRole);

const PaginatedMembersTable = ({
  members,
  pagination,
  setPagination,
  handleUpdateMemberAccess,
  handleUpdateMemberStatus,
  fetching,
  setFetching,
  memberReinviteMutation,
  memberDeleteInviteMutation,
  projectId,
  currentRole,
  totalMembers,
  pageCount,
  user,
}: PaginatedMembersTableProps) => {
  const renderSettingsButton = useCallback(
    (member: MemberType) => {
      const MoreIconButton = () => (
        <button className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-100 focus-within:bg-white/25 hover:bg-white/10 focus:bg-white/25 active:bg-white/25 disabled:opacity-50">
          <MoreVertical
            aria-hidden="true"
            className="shrink-0 justify-self-end"
          />
        </button>
      );

      if (member.status === MembershipStatus.pending) {
        const expired = hasExpired(
          member.projectInvite?.invitationTokenExpiresAt,
        );

        const handleReInvite = async () => {
          setFetching(true);
          memberReinviteMutation.mutate({
            email: member.email,
            projectId,
          });
        };

        const handleDeleteInvite = () => {
          if (member.projectInviteId) {
            setFetching(true);
            memberDeleteInviteMutation.mutate({
              projectId,
              projectInviteId: member.projectInviteId,
            });
          }
        };

        const action = {
          title: expired
            ? `Re-invite ${member.name || member.email}`
            : `Delete invite for ${member.name || member.email}`,
          handleClick: expired ? handleReInvite : handleDeleteInvite,
          disabled: fetching || member.id === user.id,
        };

        return (
          <Dropdown
            button={<MoreIconButton />}
            items={[action]}
            itemsPosition="right-0 top-3/4"
          />
        );
      }

      if (member.status === MembershipStatus.inactive) {
        const action = {
          title: `Re-activate ${member.name}`,
          handleClick: () => {
            handleUpdateMemberStatus(
              {
                currentRole: member.role,
                newRole: member.role,
                userId: member.id,
              },
              MembershipStatus.active,
            );
          },
          disabled: fetching || member.id === user.id,
        };
        return (
          <Dropdown
            button={<MoreIconButton />}
            items={[action]}
            itemsPosition="right-0 top-3/4"
          />
        );
      }

      if (member.status === MembershipStatus.active) {
        const action = {
          title: `De-activate ${member.name}`,
          handleClick: () => {
            handleUpdateMemberStatus(
              {
                currentRole: member.role,
                newRole: member.role,
                userId: member.id,
              },
              MembershipStatus.inactive,
            );
          },
          disabled:
            fetching ||
            member.id === user.id ||
            (currentRole === UserRole.maintainer &&
              member.role === UserRole.owner),
        };
        return (
          <Dropdown
            button={<MoreIconButton />}
            items={[action]}
            itemsPosition="right-0 top-3/4"
          />
        );
      }
    },
    [
      fetching,
      user.id,
      setFetching,
      memberReinviteMutation,
      projectId,
      memberDeleteInviteMutation,
      handleUpdateMemberStatus,
      currentRole,
    ],
  );

  const columns = useMemo<ColumnDef<MemberType>[]>(
    () => [
      {
        header: "Member",
        id: "member",
        accessorFn: (row) => row.name,
        cell: (info) => {
          const member = info.row.original;

          return (
            <div className="flex items-center gap-x-3">
              <Image
                className="h-10 w-10 rounded-full"
                src={getAvatar(member)}
                alt={`${member.email} picture`}
                width={40}
                height={40}
              />
              <div>
                <div className="text-base font-medium">
                  {member.name}
                  {member.email === user.email && " (Me)"}
                </div>
                <div
                  className={clsx(
                    "block text-sm",
                    member.status === "pending" ? "text-medium" : "text-light",
                  )}
                >
                  {member.email}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        header: "Status",
        id: "action",
        accessorFn: (row) => row.status,
        cell: (info) => <StatusChip status={info.row.original.status} />,
      },
      {
        header: "Role",
        id: "role",
        accessorFn: (row) => row.role,
        cell: (info) => {
          const member = info.row.original;
          return (
            <MemberDropDown
              roles={roles}
              setSelectedRole={(role) =>
                handleUpdateMemberAccess({
                  currentRole: member.role,
                  newRole: role,
                  userId: member.id,
                })
              }
              selectedRole={member.role}
              disabled={fetching}
            />
          );
        },
      },
      {
        header: "2FA Status",
        id: "twoFactorStatus",
        accessorFn: (row) => row.twoFactorEnabled,
        cell: (info) => (
          <div
            className="inline-flex"
            aria-label={
              info.row.original.twoFactorEnabled
                ? "Two-factor is enabled"
                : "Two-factor is disabled"
            }
            data-balloon-pos="up"
          >
            2FA
            {info.row.original.twoFactorEnabled ? (
              <Lock className="ml-2 h-4 w-4 text-teal-400" />
            ) : (
              <Unlock className="ml-2 h-4 w-4 text-red-400" />
            )}
          </div>
        ),
      },
      {
        id: "more",
        cell: (info) => (
          <div className="flex justify-end">
            {renderSettingsButton(info.row.original)}
          </div>
        ),
      },
    ],
    [fetching, handleUpdateMemberAccess, renderSettingsButton, user.email],
  );

  const table = useReactTable({
    data: members,
    columns,
    pageCount,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  return (
    <Fragment>
      <table className="divide-dark min-w-full table-auto divide-y">
        <thead className="border-dark border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-left text-xs font-medium sm:pl-6"
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-dark bg-darker divide-y">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    className="whitespace-nowrap px-6 py-3 text-xs"
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-4 py-3 font-medium">
        <p className="text-xs">
          Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
          {(pagination.pageIndex + 1) * pagination.pageSize > totalMembers
            ? totalMembers
            : (pagination.pageIndex + 1) * pagination.pageSize}{" "}
          of {totalMembers}{" "}
        </p>
        <div className="flex items-center gap-3 text-xs">
          <button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className={clsx(
              "flex items-center gap-x-1",
              !table.getCanPreviousPage() && "text-light cursor-not-allowed",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={clsx(
              "flex items-center gap-x-1",
              !table.getCanNextPage() && "text-light cursor-not-allowed",
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Fragment>
  );
};

interface StatusChipProps {
  status: MembershipStatus;
}

const StatusChip = ({ status }: StatusChipProps) => {
  let iconFillColor = "";
  let textColor = "";
  let borderColor = "";

  switch (status) {
    case MembershipStatus.active:
      borderColor = "border-teal-400";
      iconFillColor = "#2CD4BE";
      textColor = "text-teal-400";
      break;
    case MembershipStatus.pending:
      borderColor = "border-[#AD8301]";
      iconFillColor = "#ac8301";
      textColor = "text-[#AD8301]";
      break;
    case MembershipStatus.inactive:
      iconFillColor = "#F87171";
      borderColor = "!border-red-400";
      textColor = "text-red-400";
      break;
    default:
      break;
  }

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-1",
        borderColor,
      )}
    >
      <Circle size={16} fill={iconFillColor} color={iconFillColor} />
      <span className={`text-xs font-medium ${textColor && textColor}`}>
        {status}
      </span>
    </div>
  );
};

export default React.memo(PaginatedMembersTable);
