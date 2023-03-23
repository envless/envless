import Link from "next/link";
import { GitPullRequest } from "lucide-react";

interface DetailedPrTitleProps {
  author: string;
  title: string;
  prId: number;
  status: "open" | "closed";
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
      <h1 className="text-lg font-normal leading-relaxed text-lighter">
        <span className="mr-2 text-light">#{prId}</span>
        {title}
      </h1>

      <div className="mt-2 flex items-center gap-2">
        <div className="inline-flex inline-flex items-center items-center gap-1 rounded-full bg-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700">
          <GitPullRequest className="h-4 w-4" strokeWidth={2} />
          <span>{status}</span>
        </div>

        <div className="text-xs text-light">
          {author} wants to merge 6 keys into{" "}
          <Link href="#" className="text-teal-400 hover:underline">
            {base}
          </Link>{" "}
          from{" "}
          <Link href="#" className="text-teal-400 hover:underline">
            {current}
          </Link>
        </div>
      </div>
    </div>
  );
}
