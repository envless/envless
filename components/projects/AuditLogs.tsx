import Link from "next/link";
import { clsx } from "clsx";
import { GitBranchPlus, Shield, ShieldCheck, UserPlus } from "lucide-react";
import DateTimeAgo from "@/components/DateTimeAgo";
import { Button } from "@/components/theme";

const events = [
  {
    type: "created.project",
    icon: ShieldCheck,
    bg: "bg-teal-100",
    color: "text-teal-500",
  },
  {
    type: "created.role",
    icon: UserPlus,
    bg: "bg-indigo-100",
    color: "text-indigo-500",
  },
  {
    type: "created.branch",
    icon: GitBranchPlus,
    bg: "bg-orange-100",
    color: "text-orange-500",
  },
];

const renderIcon = (log) => {
  const event = events.find((e) => e.type === log.event);
  const Icon = event?.icon || Shield;

  return (
    <div
      className={clsx(
        event?.bg,
        "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-dark",
      )}
    >
      <Icon
        className={clsx(event?.color, "h-5 w-5 text-darkest")}
        aria-hidden="true"
      />
    </div>
  );
};

const description = (log) => {
  switch (log.event) {
    case "created.project":
      return (
        <>
          created project{" "}
          <Link
            className="font-semibold text-lightest hover:underline"
            href={`/projects/${log.project.id}`}
          >
            {log.project.name}
          </Link>
        </>
      );
    case "created.role":
      return (
        <>
          created role{" "}
          <Link
            className="font-semibold text-lightest hover:underline"
            href={`/projects/${log.project.id}`}
          >
            {log.data.role.name}
          </Link>
        </>
      );
    default:
      return null;
  }
};

export default function AuditLogs({ logs, user }) {
  return (
    <div className="flow-root md:px-14">
      <h2 className="mb-8 text-lg">Audit logs</h2>
      <ul role="list" className="-mb-8">
        {logs.map((log, idx) => (
          <li key={log.id}>
            <div className="relative pb-8">
              {idx !== logs.length - 1 ? (
                <span
                  className="absolute left-4 -ml-px h-full w-0.5 bg-dark"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">{renderIcon(log)}</div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-lightest">
                        {log.user.id === user.id
                          ? "You"
                          : log.user.name || log.user.email}{" "}
                        {description(log)}
                      </span>
                    </div>
                  </div>
                  <DateTimeAgo
                    className="mt-0.5 text-xs text-light"
                    date={log.createdAt}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Button
        small={true}
        outline={true}
        className="mt-5"
        href="/settings/audit"
      >
        More audit logs
      </Button>
    </div>
  );
}
