import * as React from "react";
import Link from "next/link";

/**
 * Button is a component that renders either a button or a link, depending on the provided `href` prop.
 * If `href` is provided, the component renders a link. Otherwise, it renders a button.
 *
 * @param {string} [type] - The type of the button to render, if the component should render a button.
 * @param {string} [sr] - The text to use for screen reader accessibility, if provided.
 * @param {() => void} [onClick] - The callback to be invoked when the user clicks on the button or link.
 * @param {string} [href] - The URL to link to, if the component should render a link.
 * @param {string} [target] - The target attribute for the link, if the component should render a link.
 * @param {React.ReactNode} children - The content to render inside the button or link.
 */

const Button = (props: {
  type?: "submit" | "button" | "reset";
  sr?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  children: React.ReactNode;
}) => {
  const { type = "button", sr, onClick, href, target, children } = props;

  if (href) {
    return (
      <Link href={href}>
        <a className="flex w-full justify-center rounded border border-transparent bg-lightest px-4 py-2 text-sm font-medium text-black shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
          {children}
          {sr && <span className="sr-only">{sr}</span>}
        </a>
      </Link>
    );
  } else {
    return (
      <button
        type={type}
        className="flex w-full justify-center rounded border border-transparent bg-lightest px-4 py-2 text-sm font-medium text-black shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        sr={sr}
        onClick={onClick}
      >
        {children}
        {sr && <span className="sr-only">{sr}</span>}
      </button>
    );
  }
};

export default Button;
