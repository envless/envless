import Link from "next/link";
import { clsx } from "clsx";
import {
  GitBranchPlus,
  MailCheck,
  Settings2,
  Shield,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import DateTimeAgo from "@/components/DateTimeAgo";

const isVowel = (word) => {
  return /[aeiou]/.test(word.charAt(0));
};

const actions = [
  {
    type: "project.created",
    icon: ShieldCheck,
    bg: "bg-teal-100",
    color: "text-teal-500",
  },
  {
    type: "access.created",
    icon: UserPlus,
    bg: "bg-indigo-100",
    color: "text-indigo-500",
  },
  {
    type: "account.updated",
    icon: Settings2,
    bg: "bg-indigo-100",
    color: "text-indigo-500",
  },
  {
    type: "branch.created",
    icon: GitBranchPlus,
    bg: "bg-orange-100",
    color: "text-orange-500",
  },
  {
    type: "invite.created",
    icon: UserPlus,
    bg: "bg-emerald-100",
    color: "text-emerald-500",
  },
  {
    type: "invite.accepted",
    icon: MailCheck,
    bg: "bg-emerald-100",
    color: "text-emerald-500",
  },
];

const renderIcon = (log) => {
  const action = actions.find((e) => e.type === log.action);
  const Icon = action?.icon || Shield;

  return (
    <div
      className={clsx(
        action?.bg,
        "ring-dark flex h-8 w-8 items-center justify-center rounded-full ring-8",
      )}
    >
      <Icon
        strokeWidth={2.5}
        className={clsx(action?.color, "text-darkest h-5 w-5")}
        aria-hidden="true"
      />
    </div>
  );
};

export default function AuditLogs({ logs, user }) {
  const description = (log) => {
    const project = log.project;
    const createdBy = log.createdBy;
    const createdFor = log.createdFor;

    const projectLink = () => (
      <Link
        className="text-xs text-teal-300 hover:underline"
        href={`/projects/${project.slug}`}
      >
        {project.name}
      </Link>
    );

    const branchLink = (branch: string) => (
      <Link
        className="text-xs text-teal-300 hover:underline"
        href={`/projects/${project.slug}/tree/${branch}`}
      >
        {branch}
      </Link>
    );

    switch (log.action) {
      case "project.created":
        return <>created {projectLink()} project</>;
      case "branch.created":
        const branch = log.data.branch.name;

        return (
          <>
            created a {branchLink(branch)} branch on {projectLink()} project
          </>
        );
      case "access.created":
        const role = log.data.access.role;
        const name =
          createdFor.id === user.id
            ? "yourself"
            : createdFor.name || createdFor.email;

        return (
          <>
            added {name} as {isVowel(role) ? "an" : "a"} {role} of{" "}
            {projectLink()} project
          </>
        );
      case "account.updated":
        return (
          <>
            updated your{" "}
            <Link
              className="text-xs text-teal-300 hover:underline"
              href="/settings"
            >
              account.
            </Link>
          </>
        );
      case "invite.created":
        return (
          <>
            invited{" "}
            {createdFor.id === user.id
              ? "you"
              : createdFor.name || createdFor.email}{" "}
            to join {projectLink()} project
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {logs &&
          logs.map((log, idx) => (
            <li key={log.id}>
              <div className="relative pb-4">
                {idx !== logs.length - 1 ? (
                  <span
                    className="bg-dark absolute left-4 -ml-px h-full w-0.5"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">{renderIcon(log)}</div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="text-lightest font-medium">
                          {log.createdById === user.id
                            ? "You"
                            : log.createdBy.name || log.createdBy.email}{" "}
                          {description(log)}
                        </span>
                      </div>
                    </div>
                    <DateTimeAgo
                      className="text-light mt-0.5 text-xs"
                      date={log.createdAt}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
