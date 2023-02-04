import React from "react";

/**
 * A text component that can be used to display text with different sizes and colors.
 *
 * @param {string} [size="medium"] The size of the text. Can be "small", "medium", or "large".
 * @param {string} [color="light-900"] The color of the text. Can be "light-50", "lll2", or "light-900".
 */

type SpanProps = {
  size?: "sm" | "lg" | "xl" | "2xl";
  color?: "light-50" | "lll2" | "light-900";
  children: React.ReactNode;
};

const Span = (props: SpanProps) => {
  const { size, color, children } = props;

  let className = "";
  switch (size) {
    case "sm":
      className = "text-sm";
      break;
    case "lg":
      className = "text-lg";
      break;
    case "xl":
      className = "text-xl";
    case "2xl":
      className = "text-2xl";
      break;
    default:
      className = "text-base";
      break;
  }

  switch (color) {
    case "light-50":
      className += " text-light-50";
      break;
    case "lll2":
      className += " text-lll2";
      break;
    default: // light-900 and default
      className += " text-light-900";
      break;
  }

  return <span className={className}>{children}</span>;
};

Span.defaultProps = {
  size: "medium",
  color: "light-900",
};

export default Span;
