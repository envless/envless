import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

type InputGroupTypes = {
  icon: ReactNode;
  full?: boolean;
} & ComponentProps<"input">;

export default function InputGroup({
  full,
  icon,
  className,
  disabled,
  ...props
}: InputGroupTypes) {
  return (
    <div className={clsx("relative flex items-center", full && "w-full")}>
      <input
        {...props}
        className={clsx(
          disabled && "cursor-not-allowed bg-light/40",
          "block appearance-none rounded border border-light/50 bg-darker px-3 py-2 pr-10 focus:border-dark focus:outline-none focus:ring-light sm:text-sm",
          className,
          full && "w-full",
        )}
      />

      <button className="absolute inset-y-0 right-0 mr-3 flex items-center rounded p-1">
        {icon}
      </button>
    </div>
  );
}
