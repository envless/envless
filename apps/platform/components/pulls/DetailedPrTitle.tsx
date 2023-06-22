import Link from "next/link";
import { useRouter } from "next/router";
import type { PullRequestStatus } from "@prisma/client";
import PullRequestStatusBadge from "./PullRequestStatusBadge";

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
  const router = useRouter();
  const projectSlug = router.query.slug as string;

  return (
    <div className="w-full">
      <h1 className="text-lighter text-lg font-normal leading-relaxed">
        <span className="text-light mr-2">#{prId}</span>
        {title}
      </h1>

      <div className="mt-2 flex items-center gap-2">
        <PullRequestStatusBadge status={status} />
        <div className="text-light text-xs">
          {author} opened a pull request to merge{" "}
          <Link
            href={`/projects/${projectSlug}/tree/${current}`}
            className="text-teal-400 hover:underline"
          >
            {current}
          </Link>{" "}
          into{" "}
          <Link
            href={`/projects/${projectSlug}/tree/${base}`}
            className="text-teal-400 hover:underline"
          >
            {base}
          </Link>
        </div>
      </div>
    </div>
  );
}
