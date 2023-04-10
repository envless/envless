import Image from "next/image";
import React, { Fragment, useCallback, useMemo } from "react";
import type { MemberType, UserType } from "@/types/resources";
import { getInitials } from "@/utils/helpers";
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
  CircleSlashed,
  Lock,
  MailCheck,
  Trash,
  Unlock,
} from "lucide-react";
import MenuButton, { type MenuButtonAction } from "../MenuButton";
import MemberDropDown from "./MemberDropDown";
import { getAvatar } from "@/utils/getAvatar";

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

        const action: MenuButtonAction = {
          label: expired
            ? `Re-invite ${member.email}`
            : `Delete invite for ${member.email}`,
          onClick: expired ? handleReInvite : handleDeleteInvite,
          icon: expired ? (
            <MailCheck color="yellow" className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Trash className="h-5 w-5" strokeWidth={2} />
          ),
        };
        return (
          <MenuButton
            disabled={fetching || member.id === user.id}
            actions={[action]}
          />
        );
      }

      if (member.status === MembershipStatus.inactive) {
        const action: MenuButtonAction = {
          label: `Re-activate ${member.name}`,
          onClick: () => {
            handleUpdateMemberStatus(
              {
                currentRole: member.role,
                newRole: member.role,
                userId: member.id,
              },
              MembershipStatus.active,
            );
          },
          icon: <Unlock color="#1A8CD8" className="h-5 w-5" strokeWidth={2} />,
        };
        return (
          <MenuButton
            disabled={fetching || member.id === user.id}
            actions={[action]}
          />
        );
      }

      if (member.status === MembershipStatus.active) {
        const action: MenuButtonAction = {
          label: `De-activate ${member.name}`,
          onClick: () => {
            handleUpdateMemberStatus(
              {
                currentRole: member.role,
                newRole: member.role,
                userId: member.id,
              },
              MembershipStatus.inactive,
            );
          },
          icon: (
            <CircleSlashed
              color="#F87171"
              className="float-right h-5 w-5"
              strokeWidth={2}
            />
          ),
        };
        return (
          <MenuButton
            disabled={
              fetching ||
              member.id === user.id ||
              (currentRole === UserRole.maintainer &&
                member.role === UserRole.owner)
            }
            actions={[action]}
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
            <div className="inline-flex items-center sm:pl-6">
              <div className="h-10 w-10 flex-shrink-0">
                <Image
                  className="h-10 w-10 rounded-full"
                  src={getAvatar(member)}
                  alt={`${member.email} picture`}
                  width={40}
                  height={40}
                />
              </div>
              <div className="ml-4">
                <div className="text-base font-medium">
                  {member.name}
                  {member.email === user.email && " (Me)"}
                </div>
                <div
                  className={clsx(
                    "text-sm",
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
        header: "Enabled 2FA",
        id: "enabledTwoFactor",
        accessorFn: (row) => row.twoFactorEnabled,
        cell: (info) => (
          <div className="inline-flex">
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
        <thead className="border-y border-gray-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-left text-sm sm:pl-6"
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
        <tbody className="bg-dark">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="align-middle">
                {row.getVisibleCells().map((cell) => (
                  <td
                    className="whitespace-nowrap py-3 px-6"
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

      <div className="flex items-center justify-between py-3 px-4 font-medium">
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
  let bgColor = "";
  let iconFillColor = "";
  let textColor = "";
  let borderColor = "";

  switch (status) {
    case MembershipStatus.active:
      bgColor = "bg-green-600";
      iconFillColor = "green";
      textColor = "text-white";
      break;
    case MembershipStatus.pending:
      bgColor = "bg-yellow-500";
      iconFillColor = "#ac8301";
      textColor = "text-gray-900";
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
        "inline-flex items-center gap-1 rounded-full border border-transparent py-1 px-2",
        bgColor && bgColor,
        borderColor && borderColor,
      )}
    >
      <Circle size={16} fill={iconFillColor} color={bgColor} />
      <span className={`text-xs font-medium ${textColor && textColor}`}>
        {status}
      </span>
    </div>
  );
};

export default React.memo(PaginatedMembersTable);
