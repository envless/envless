import { Fragment } from "react";
import {
  ChatBubbleLeftEllipsisIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { indexOf } from "lodash";

const activity = [
  {
    id: 1,
    type: "invite",
    person: { name: "Sergey Tyan", href: "#" },
    imageUrl: "https://avatar.vercel.sh/ST.svg?text=ST",
    invite: "Invited test@example.com to Untitled as a Developer",
    date: "30 minutes ago",
  },
  {
    id: 2,
    type: "branch",
    person: { name: "Hilary Mahy", href: "#" },
    branch: { name: "staging", href: "#" },
    date: "2d ago",
  },
  {
    id: 3,
    type: "merge",
    person: { name: "Hilary Mahy", href: "#" },
    merge: [
      { name: "staging", href: "#", color: "bg-indigo-500" },
      { name: "main", href: "#", color: "bg-rose-500" },
    ],
    date: "6h ago",
  },
  {
    id: 4,
    type: "invite",
    person: { name: "Puru Dahal", href: "#" },
    imageUrl: "https://avatar.vercel.sh/PD.svg?text=PD",
    invite: "Accepted invitation to Untitled as a Developer",
    date: "2h ago",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Activities() {
  return (
    <div className="flow-root px-14">
      <h2 className="mb-8 text-lg font-bold">Activities</h2>
      <ul role="list" className="-mb-8">
        {activity.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id}>
            <div className="relative pb-8">
              {activityItemIdx !== activity.length - 1 ? (
                <span
                  className="absolute left-5 -ml-px h-full w-0.5 bg-dark"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                {activityItem.type === "invite" ? (
                  <>
                    <div className="relative">
                      <img
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-light ring-8 ring-dark"
                        src={activityItem.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <a
                            href={activityItem.person.href}
                            className="font-medium text-lightest"
                          >
                            {activityItem.person.name}
                          </a>
                        </div>
                        <p className="mt-0.5 text-sm text-light">
                          {activityItem.date}
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-lighter">
                        <p>{activityItem.invite}</p>
                      </div>
                    </div>
                  </>
                ) : activityItem.type === "branch" ? (
                  <>
                    <div>
                      <div className="relative px-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lightest ring-8 ring-dark">
                          <UserCircleIcon
                            className="h-5 w-5 text-darkest"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                      <div className="text-sm text-light">
                        <a
                          href={activityItem.person.href}
                          className="font-medium text-lighter"
                        >
                          {activityItem.person.name}
                        </a>{" "}
                        created a branch from main{" "}
                        <a
                          href={activityItem.branch?.href}
                          className="font-medium text-lighter"
                        >
                          {activityItem.branch?.name}
                        </a>{" "}
                        <span className="whitespace-nowrap">
                          {activityItem.date}
                        </span>
                      </div>
                    </div>
                  </>
                ) : activityItem.type === "merge" ? (
                  <>
                    <div>
                      <div className="relative px-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lightest ring-8 ring-dark">
                          <TagIcon
                            className="h-5 w-5 text-darkest"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-0">
                      <div className="text-sm leading-8 text-light">
                        <span className="mr-0.5">
                          <a
                            href={activityItem.person.href}
                            className="font-medium text-lighter"
                          >
                            {activityItem.person.name}
                          </a>{" "}
                          merged{" "}
                        </span>{" "}
                        <span className="mr-0.5">
                          {/* @ts-ignore */}
                          {activityItem.merge.map((branch) => (
                            <Fragment key={branch.name}>
                              <a
                                href={branch.href}
                                className="relative inline-flex items-center rounded-full border border-light px-3 py-0.5 text-sm"
                              >
                                <span className="absolute flex flex-shrink-0 items-center justify-center">
                                  <span
                                    className={classNames(
                                      branch.color,
                                      "h-1.5 w-1.5 rounded-full",
                                    )}
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="ml-3.5 font-medium text-lighter">
                                  {branch.name}
                                </span>
                              </a>{" "}
                            </Fragment>
                          ))}
                        </span>
                        <span className="whitespace-nowrap">
                          {activityItem.date}
                        </span>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
