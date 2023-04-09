import React from "react";

/**
 * A text component that can be used to display text with different sizes and colors.
 *
 * @param {string} [className] The class name of the text.
 * @param {string} [size="medium"] The size of the text. Can be "small", "medium", or "large".
 * @param {string} [color="lightest"] The color of the text. Can be "light", "lighter", or "lightest".
 */

type ParagraphProps = {
  className?: string;
  size?: "sm" | "lg" | "xl" | "2xl" | "3xl";
  color?: "light" | "lighter" | "lightest";
  children: React.ReactNode;
};

const Paragraph = (props: ParagraphProps) => {
  const { size, color, children, className } = props;

  let klassName = "";
  switch (size) {
    case "sm":
      klassName = "text-sm";
      break;
    case "lg":
      klassName = "text-lg";
      break;
    case "xl":
      klassName = "text-xl";
    case "2xl":
      klassName = "text-2xl";
      break;
    case "3xl":
      klassName = "text-3xl";
      break;
    default:
      klassName = "text-base";
      break;
  }

  switch (color) {
    case "light":
      klassName += " text-light";
      break;
    case "lighter":
      klassName += " text-lighter";
      break;
    default: // lightest and default
      klassName += " text-lightest";
      break;
  }

  klassName += " " + className;

  return <p className={klassName}>{children}</p>;
};

Paragraph.defaultProps = {
  size: "medium",
  color: "lightest",
};

export default Paragraph;
