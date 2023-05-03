import clsx from "clsx";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  type: "success" | "danger" | "warning" | "info";
}

export const Label = ({
  children,
  className,
  type,
  size = "sm",
}: LabelProps) => {
  const classes = clsx(
    "inline-flex items-center rounded font-semibold uppercase tracking-wide",
    {
      "bg-emerald-200 text-emerald-700": type === "success",
      "bg-red-200 text-red-700": type === "danger",
      "bg-yellow-200 text-yellow-700": type === "warning",
      "bg-indigo-200 text-indigo-700": type === "info",
    },

    {
      "px-2.5 py-0.5 text-xs": size === "sm",
      "px-3 py-0.5 text-md": size === "md",
      "px-4 py-1 text-lg": size === "lg",
    },

    className,
  );

  return <span className={classes}>{children}</span>;
};

export default Label;
