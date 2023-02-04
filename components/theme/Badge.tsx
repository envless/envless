import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  type: "success" | "danger" | "warning" | "info";
}

export const Badge = ({ children, className, type }: BadgeProps) => {
  const classes = clsx(
    "flex p-1.5 h-8 w-8 items-center justify-center rounded-full ring-5 ring-dark-900",
    {
      "bg-emerald-200 text-emerald-700": type === "success",
      "bg-red-200 text-red-700": type === "danger",
      "bg-yellow-200 text-yellow-700": type === "warning",
      "bg-indigo-200 text-indigo-700": type === "info",
    },

    className,
  );

  return <div className={classes}>{children}</div>;
};

export default Badge;
