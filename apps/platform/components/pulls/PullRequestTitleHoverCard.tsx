import Link from "next/link";
import { ReactNode } from "react";
import { PullRequestStatus } from "@prisma/client";
import * as HoverCard from "@radix-ui/react-hover-card";
import {
  ArrowLeft,
  GitMerge,
  GitPullRequest,
  GitPullRequestClosed,
} from "lucide-react";

interface PullRequestHoverCardProps {
  triggerComponent: ReactNode;
  projectSlug: string;
  projectName: string;
  pullRequestTitle: string;
  pullRequestStatus: string;
  baseBranchName;
  currentBranchName;
  createdAt: Date;
  createdBy: string;
}

export default function PullRequestTitleHoverCard({
  triggerComponent,
  projectName,
  projectSlug,
  pullRequestTitle,
  pullRequestStatus,
  baseBranchName,
  currentBranchName,
  createdAt,
  createdBy,
}: PullRequestHoverCardProps) {
  const createdTime = new Date(createdAt).toDateString();

  return (
    <HoverCard.Root openDelay={200} closeDelay={200}>
      <HoverCard.Trigger asChild>{triggerComponent}</HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className="divide-dark bg-darker w-[350px] divide-y rounded text-xs shadow-lg"
          sideOffset={5}
        >
          <div className="flex w-full flex-col gap-[10px] px-3 py-4">
            <div className="text-light">
              <Link href={`/projects/${projectSlug}`} className="underline">
                {projectName}
              </Link>{" "}
              on {createdTime}
            </div>

            <div className="flex items-start gap-[10px]">
              <div className="shrink-0">
                {pullRequestStatus === PullRequestStatus.open && (
                  <GitPullRequest className="h-4 w-4 text-emerald-700" />
                )}

                {pullRequestStatus === PullRequestStatus.closed && (
                  <GitPullRequestClosed className="h-4 w-4 text-red-700" />
                )}

                {pullRequestStatus === PullRequestStatus.merged && (
                  <GitMerge className="h-4 w-4 text-indigo-700" />
                )}
              </div>

              <div className="flex flex-col">
                <p className="text-md font-bold">{pullRequestTitle} </p>
                <div className="mt-2 inline-flex items-center gap-2">
                  <span className="bg-dark text-light max-w-[6rem] truncate rounded px-1 py-0.5">
                    {baseBranchName}
                  </span>
                  <ArrowLeft className="text-lighter h-4 w-4 shrink-0" />
                  <span className="bg-dark text-light max-w-[6rem] truncate rounded px-1 py-0.5">
                    {currentBranchName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3">
            <div className="h-5 w-5 rounded-full bg-teal-400"></div>
            <p className="text-light text-xs">{createdBy} opened</p>
          </div>
          <HoverCard.Arrow className="text-dark" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
