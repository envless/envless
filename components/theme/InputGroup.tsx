import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

type InputGroupTypes = {
  icon: ReactNode;
  full?: boolean;
  iconActionClick?: () => void;
} & ComponentProps<"input">;

export default function InputGroup({
  full,
  icon,
  className,
  disabled,
  iconActionClick,
  ...props
}: InputGroupTypes) {
  return (
    <div className={clsx("relative flex items-center", full && "w-full")}>
      <textarea
        rows={1}
        className={clsx(
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
