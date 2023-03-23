import { forwardRef } from "react";
import clsx from "clsx";

export type ButtonSize = "sm" | "md" | "lg" | "xl" | "xxl";

export interface ButtonProps {
  size?: ButtonSize;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: any | SVGElement;
  iconAlign?: "left" | "right";
  type?: "submit" | "reset" | "button";
}

export type ButtonRef = HTMLButtonElement;

/**
 * Buttons communicate actions that users can take.
 */
export const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  const {
    size = "sm",
    disabled = false,
    label,
    onClick,
    type = "button",
  } = props;

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        size === "sm" ? "px-3.5 py-2" : "",
        size === "md" ? "px-4 py-2.5" : "",
        size === "lg" ? "px-4.5 py-2.5" : "",
        size === "xl" ? "px-5 py-3" : "",
        size === "xxl" ? "px-7 py-4" : "",
        // Default
        "flex items-center justify-center gap-2 rounded-lg bg-black text-sm font-medium text-white",
      )}
    >
      {label}
    </button>
  );
});

Button.displayName = "Button";
