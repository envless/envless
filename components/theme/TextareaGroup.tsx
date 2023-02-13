import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

type TextareaTypes = {
  icon: ReactNode;
  full?: boolean;
  iconActionClick?: () => void;
} & ComponentProps<"textarea">;

export default function Textarea({
  full,
  icon,
  className,
  disabled,
  iconActionClick,
  ...props
}: TextareaTypes) {
  return (
    <div className={clsx("relative flex items-center", full && "w-full")}>
      <textarea
        {...props}
        rows={1}
        disabled={disabled}
        className={clsx(
          className,
          "input-primary w-full scrollbar-thin scrollbar-track-dark scrollbar-thumb-darker",
        )}
      />

      <button
        onClick={iconActionClick}
        className="absolute inset-y-0 right-0 mr-3 flex items-center rounded p-1"
      >
        {icon}
      </button>
    </div>
  );
}
