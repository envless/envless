import Link from "next/link";
import {
  MouseEventHandler,
  MutableRefObject,
  ReactNode,
  forwardRef,
} from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { clsx } from "clsx";

const button = cva(
  [
    "focus:secondary-none flex justify-center rounded-md border px-4 font-medium shadow focus:ring-2 disabled:cursor-not-allowed disabled:opacity-75",
  ],
  {
    variants: {
      variant: {
        primary: ["bg-lightest text-darkest hover:bg-lighter"],
        secondary: [
          "border-2 border-dark bg-dark text-lightest shadow-xl hover:bg-dark/60",
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
  variant?: "primary" | "secondary";
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
} & VariantProps<typeof button>;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      type = "submit",
      size = "md",
      width = "fit",
      sr,
      onClick,
      href,
      target,
      className,
      small,
      children,
      ...props
    },
    ref,
  ) => {
    if (href) {
      return (
        <Link
          className={button({ variant, size, className })}
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
          className={button({ variant, size, className })}
          ref={ref as MutableRefObject<HTMLButtonElement>}
          {...props}
        >
          {children}
          {sr && <span className="sr-only">{sr}</span>}
        </button>
      );
    }
  },
);

// const Button2 = (props: {
//   type?: "submit" | "button" | "reset";
//   sr?: string;
//   onClick?: () => void;
//   href?: string;
//   full?: boolean;
//   target?: string;
//   className?: string;
//   small?: boolean;
//   secondary: boolean;
//   disabled?: boolean;
//   children: React.ReactNode;
// }) => {
//   const {
//     type = "button",
//     disabled = false,
//     sr,
//     onClick,
//     href,
//     full,
//     target,
//     className,
//     small,
//     secondary,
//     children,
//   } = props;

//   if (href) {
//     return (
//       <Link
//         href={href}
//         className={clsx(
//           className,
//           full ? "w-full" : "w-fit",
//           small ? "py-1.5 text-xs" : "py-2 text-sm",
//           secondary
//             ? " border-2 border-dark bg-dark text-lightest shadow-xl hover:bg-dark/60"
//             : "bg-lightest text-darkest hover:bg-lighter",

//           "focus:secondary-none flex justify-center rounded-md border px-4 font-medium shadow focus:ring-2 disabled:cursor-not-allowed disabled:opacity-75",
//         )}
//       >
//         {children}
//         {sr && <span className="sr-only">{sr}</span>}
//       </Link>
//     );
//   } else {
//     return (
//       <button
//         type={type}
//         className={clsx(
//           className,
//           full ? "w-full" : "w-fit",
//           small ? "py-1.5 text-xs" : "py-2 text-sm",
//           secondary
//             ? "border-2 border-dark bg-dark text-lightest shadow-xl hover:bg-dark/60"
//             : "bg-lightest text-darkest hover:bg-lighter",

//           "focus:secondary-none flex justify-center rounded-md border px-4 font-medium shadow focus:ring-2 disabled:cursor-not-allowed disabled:opacity-75",
//         )}
//         onClick={onClick}
//         disabled={disabled}
//       >
//         {children}
//         {sr && <span className="sr-only">{sr}</span>}
//       </button>
//     );
//   }
// };

export default Button;
