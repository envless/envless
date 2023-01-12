import Link from "next/link";
import * as React from "react";
import { clsx } from "clsx";

/**
 * Button is a component that renders either a button or a link, depending on the provided `href` prop.
 * If `href` is provided, the component renders a link. Otherwise, it renders a button.
 *
 * @param {string} [type] - The type of the button to render, if the component should render a button.
 * @param {string} [sr] - The text to use for screen reader accessibility, if provided.
 * @param {() => void} [onClick] - The callback to be invoked when the user clicks on the button or link.
 * @param {string} [href] - The URL to link to, if the component should render a link.
 * @param {boolean} [full] - Whether the button should take up the full width of its container.
 * @param {boolean} [outline] - Whether the button should be outlined.
 * @param {boolean} [disablad] - Whether on not the button should be disabled.
 * @param {string} [target] - The target attribute for the link, if the component should render a link.
 * @param {string} [className] - The class name to apply to the button or link.
 * @param {boolean} [small] - Whether the button should be small.
 * @param {React.ReactNode} children - The content to render inside the button or link.
 */

const Button = (props: {
  type?: "submit" | "button" | "reset";
  sr?: string;
  onClick?: () => void;
  href?: string;
  full?: boolean;
  target?: string;
  className?: string;
  small?: boolean;
  outline: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  const {
    type = "button",
    sr,
    onClick,
    href,
    full,
    target,
    className,
    small,
    disabled,
    outline,
    children,
  } = props;

  if (href) {
    return (
      <Link
        href={href}
        className={clsx(
          className,
          full ? "w-full" : "w-fit",
          small ? "py-1" : "py-2",
          outline
            ? "border-2 border-dark bg-transparent text-lightest hover:bg-dark"
            : "border-transparent bg-lightest text-darkest hover:bg-gray-200",

          "flex justify-center rounded-md border px-4 text-sm font-medium shadow focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-75",
        )}
      >
        {children}
        {sr && <span className="sr-only">{sr}</span>}
      </Link>
    );
  } else {
    return (
      <button
        type={type}
        className={clsx(
          className,
          full ? "w-full" : "w-fit",
          small ? "py-1" : "py-2",
          outline
            ? "border-2 border-dark bg-darker text-lightest hover:bg-dark"
            : "border-transparent bg-lightest text-darkest hover:bg-gray-200",

          "flex justify-center rounded-md border px-4 text-sm font-medium shadow focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-75",
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
        {sr && <span className="sr-only">{sr}</span>}
      </button>
    );
  }
};

Button.defaultProps = {
  full: false,
  type: "button",
  disablad: false,
  outline: false,
  small: false,
};

export default Button;
