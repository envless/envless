import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

type TextareaTypes = {
  icon: ReactNode;
  full?: boolean;
  rows?: number;
  iconActionClick?: () => void;
} & ComponentProps<"textarea">;

export default function Textarea({
  full,
  icon,
  rows,
  className,
  disabled,
  iconActionClick,
  ...props
}: TextareaTypes) {
  return (
    <div className={clsx("relative flex items-center", full && "w-full")}>
      <textarea
        {...props}
        rows={rows || 1}
        disabled={disabled}
        className={clsx(
          className,
          "input-primary w-full scrollbar-thin scrollbar-track-dark scrollbar-thumb-darker",
        )}
      />

      <button
        onClick={iconActionClick}
        className="absolute bottom-4 right-0 mr-3"
      >
        {icon}
      </button>
    </div>
  );
}
