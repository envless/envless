import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import clsx from "clsx";

/**
 * Popover component.
 *
 * @param {Props} props - The component's props.
 * @returns {JSX.Element} The component's JSX element.
 */

export enum BranchPopoverAlignment {
  start = "start",
  center = "center",
  end = "end",
}

interface Props {
  button: React.ReactNode;
  children: React.ReactNode;
  zIndex?: 10 | 20 | 30 | 40 | 50;
  align?: BranchPopoverAlignment;
  fullButtonWidth?: boolean;
}

const Popover = (props: Props) => {
  const {
    zIndex = 20,
    align = BranchPopoverAlignment.center,
    fullButtonWidth = false,
    button,
    children,
  } = props;

  return (
    <div
      className={clsx(
        fullButtonWidth && "w-full",
        "relative inline-block text-left",
        {
          "z-10": zIndex === 10,
          "z-20": zIndex === 20,
          "z-30": zIndex === 30,
          "z-40": zIndex === 40,
          "z-50": zIndex === 50,
        },
      )}
    >
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>{button}</PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          align={align}
          sideOffset={4}
          className={clsx(
            "mx-2 bg-darker",
            "w-56 rounded shadow-md md:w-56",
            "shadow-xl shadow-black ring-2 ring-dark focus:outline-none",
            "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
          )}
        >
          <PopoverPrimitive.Arrow className="fill-current text-dark" />

          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </div>
  );
};

export default Popover;
