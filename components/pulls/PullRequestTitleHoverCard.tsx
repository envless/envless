import Link from "next/link";
import { ReactNode } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { ArrowLeft, GitPullRequest } from "lucide-react";

interface PullRequestHoverCardProps {
  triggerComponent: ReactNode;
  projectSlug: string;
  projectName: string;
  pullRequestTitle: string;
  pullRequestStatus: string;
}

export default function PullRequestTitleHoverCard({
  triggerComponent,
  projectName,
  projectSlug,
  pullRequestTitle,
  pullRequestStatus,
}: PullRequestHoverCardProps) {
  return (
    <HoverCard.Root openDelay={200} closeDelay={200}>
      <HoverCard.Trigger asChild>{triggerComponent}</HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className="w-[350px] divide-y divide-dark rounded bg-darker text-xs shadow-lg"
          sideOffset={5}
        >
          <div className="flex w-full flex-col gap-[10px] px-3 py-4">
            <div className="text-light">
              <Link href={`/projects/${projectSlug}`} className="underline">
                {projectName}
              </Link>{" "}
              on Feb 22
            </div>

            <div className="flex items-start gap-[10px]">
              <div className="shrink-0">
                <GitPullRequest className="h-4 w-4 text-emerald-200" />
              </div>

              <div className="flex flex-col">
                <p className="text-md font-bold">{pullRequestTitle} </p>
                <div className="mt-2 inline-flex items-center gap-2">
                  <span className="max-w-[6rem] truncate rounded bg-dark px-1 py-0.5 text-light">
                    envless:main
                  </span>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-lighter" />
                  <span className="max-w-[6rem] truncate rounded bg-dark px-1 py-0.5 text-light">
                    some-feature-name
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3">
            <div className="h-5 w-5 rounded-full bg-teal-400"></div>
            <p className="text-xs text-light">You opened</p>
          </div>
          <HoverCard.Arrow className="text-dark" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
