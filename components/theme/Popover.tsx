import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import clsx from "clsx";

/**
 * Popover component.
 *
 * @param {Props} props - The component's props.
 * @returns {JSX.Element} The component's JSX element.
 */

interface Props {
  button: React.ReactNode;
  children: React.ReactNode;
  zIndex?: 10 | 50;
}

const Popover = (props: Props) => {
  const { zIndex = 50, button, children } = props;

  return (
    <div
      className={clsx("relative inline-block text-left", {
        "z-50": zIndex === 50,
        "z-10": zIndex === 10,
      })}
    >
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>{button}</PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          align="center"
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
