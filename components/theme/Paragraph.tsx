import React from "react";

/**
 * A text component that can be used to display text with different sizes and colors.
 *
 * @param {string} [className] The class name of the text.
 * @param {string} [size="medium"] The size of the text. Can be "small", "medium", or "large".
 * @param {string} [color="light-900"] The color of the text. Can be "light-50", "lll2", or "light-900".
 */

type ParagraphProps = {
  className?: string;
  size?: "sm" | "lg" | "xl" | "2xl" | "3xl";
  color?: "light-50" | "lll2" | "light-900";
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
    case "light-50":
      klassName += " text-light-50";
      break;
    case "lll2":
      klassName += " text-lll2";
      break;
    default: // light-900 and default
      klassName += " text-light-900";
      break;
  }

  klassName += " " + className;

  return <p className={klassName}>{children}</p>;
};

Paragraph.defaultProps = {
  size: "medium",
  color: "light-900",
};

export default Paragraph;
