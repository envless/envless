import Link from "next/link";
import {
  MouseEventHandler,
  MutableRefObject,
  ReactNode,
  forwardRef,
} from "react";
import { type VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import { LoaderIcon } from "../icons";

const buttonStyles = cva(
  [
    "transition-colors focus:secondary-none flex justify-center rounded-md border px-4 font-medium shadow focus:outline-none disabled:cursor-not-allowed disabled:opacity-75",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-lightest text-darkest hover:bg-lighter"],
        secondary: [
          "border-dark bg-dark text-lightest hover:bg-dark/60 shadow-xl",
        ],
        danger: ["bg-red-500 border-red-500 text-lightest hover:bg-red-600"],
        "primary-outline": [
          "border-light hover:border-lighter hover:bg-darker",
        ],
        "danger-outline": [
          "border-2 border-dark hover:border-red-500 text-red-500",
        ],
      },
      size: {
        sm: ["py-1.5 text-xs"],
        md: ["py-2 text-sm"],
      },
      width: {
        full: ["w-full"],
        fit: ["w-fit"],
      },
    },
  },
);

type ButtonProps = {
  type?: "submit" | "button" | "reset";
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "primary-outline"
    | "danger-outline";
  size?: "sm" | "md";
  width?: "full" | "fit";
  sr?: string;
  onClick?: MouseEventHandler;
  href?: string;
  target?: string;
  className?: string;
  small?: boolean;
  disabled?: boolean;
  children: ReactNode;
  loading: boolean;
  leftIcon?: ReactNode;
} & VariantProps<typeof buttonStyles>;

const ButtonV2 = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      type = "submit",
      size = "md",
      width = "fit",
      loading = false,
      sr,
      onClick,
      href,
      target,
      className,
      small,
      children,
      disabled,
      leftIcon,
      ...props
    },
    ref,
  ) => {
    if (href) {
      return (
        <Link
          className={buttonStyles({ variant, size, width, className })}
          ref={ref as MutableRefObject<HTMLAnchorElement>}
          href={href}
          {...props}
        >
          {children}
          {sr && <span className="sr-only">{sr}</span>}
        </Link>
      );
    } else {
      return (
        <button
          type={type}
          className={buttonStyles({ variant, size, width, className })}
          ref={ref as MutableRefObject<HTMLButtonElement>}
          disabled={disabled || loading}
          onClick={onClick}
          {...props}
        >
          <span className={clsx(loading && "invisible")}>
            {leftIcon && leftIcon}
          </span>
          <span className={clsx(loading && "invisible")}>{children}</span>

          {loading && <LoaderIcon className="absolute h-5 w-5 animate-spin" />}

          {sr && <span className="sr-only">{sr}</span>}
        </button>
      );
    }
  },
);

ButtonV2.displayName = "ButtonV2";
export default ButtonV2;
