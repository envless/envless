import Link from "next/link";
import type { PullRequestStatus } from "@prisma/client";
import { GitPullRequest } from "lucide-react";

interface DetailedPrTitleProps {
  author: string;
  title: string;
  prId: number;
  status: PullRequestStatus;
  base?: string;
  current?: string;
}

export default function DetailedPrTitle({
  title,
  prId,
  author,
  status,
  base,
  current,
}: DetailedPrTitleProps) {
  return (
    <div className="w-full">
      <h1 className="text-lighter text-lg font-normal leading-relaxed">
        <span className="text-light mr-2">#{prId}</span>
        {title}
      </h1>

      <div className="mt-2 flex items-center gap-2">
        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700">
          <GitPullRequest className="h-4 w-4" strokeWidth={2} />
          <span>{status}</span>
        </div>

        <div className="text-light text-xs">
          {author} opened a pull request to merge{" "}
          <Link href="#" className="text-teal-400 hover:underline">
            {current}
          </Link>{" "}
          into{" "}
          <Link href="#" className="text-teal-400 hover:underline">
            {base}
          </Link>
        </div>
      </div>
    </div>
  );
}
