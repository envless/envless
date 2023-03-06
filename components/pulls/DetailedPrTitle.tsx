import Link from "next/link";
import { GitPullRequest } from "lucide-react";

export default function DetailedPrTitle() {
  return (
    <div className="w-full">
      <h1 className="text-lg font-normal leading-relaxed text-lighter">
        feat: additional security - ask users to provide OTP for one last time
        before they disable two factor auth
        <span className="ml-2 text-light">#110</span>
      </h1>

      <div className="mt-2 flex items-center gap-2">
        <div className="inline-flex inline-flex items-center items-center gap-1 rounded-full bg-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700">
          <GitPullRequest className="h-4 w-4" strokeWidth={2} />
          <span>Open</span>
        </div>

        <div className="text-xs text-light">
          chetannn wants to merge 6 keys into{" "}
          <Link href="#" className="text-teal-400 hover:underline">
            main
          </Link>{" "}
          from{" "}
          <Link href="#" className="text-teal-400 hover:underline">
            feat/additional-security
          </Link>
        </div>
      </div>
    </div>
  );
}
