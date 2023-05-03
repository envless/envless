import { ComponentProps, forwardRef } from "react";
import clsx from "clsx";

interface Props extends ComponentProps<"input"> {
  full: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(function BaseInput(
  { full, className, disabled, ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      disabled={disabled}
      className={clsx(
        className,
        disabled && "bg-light/40 cursor-not-allowed",
        full && "w-full",
        "input-primary",
      )}
    />
  );
});

export default Input;
