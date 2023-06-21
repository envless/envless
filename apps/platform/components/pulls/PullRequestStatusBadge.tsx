import React from "react";
import { PullRequestStatus } from "@prisma/client";
import clsx from "clsx";
import { GitMerge, GitPullRequest, GitPullRequestClosed } from "lucide-react";

export default function PullRequestStatusBadge({
  status,
}: {
  status: PullRequestStatus;
}) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold",
        status === PullRequestStatus.open && "bg-emerald-200 text-emerald-700",
        status === PullRequestStatus.closed && "bg-red-200 text-red-700",
        status === PullRequestStatus.merged && "bg-indigo-200 text-indigo-700",
      )}
    >
      {status === PullRequestStatus.open && (
        <GitPullRequest className="h-4 w-4" strokeWidth={2} />
      )}

      {status === PullRequestStatus.closed && (
        <GitPullRequestClosed className="h-4 w-4" strokeWidth={2} />
      )}

      {status === PullRequestStatus.merged && (
        <GitMerge className="h-4 w-4" strokeWidth={2} />
      )}
      <span>{status}</span>
    </div>
  );
}
