import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import cx from "classnames";

/**
 * Popover component.
 *
 * @param {Props} props - The component's props.
 * @returns {JSX.Element} The component's JSX element.
 */

interface Props {
  button: React.ReactNode;
  children: React.ReactNode;
}

const Popover = (props: Props) => {
  const { button, children } = props;

  return (
    <div className="relative z-10 inline-block text-left">
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>{button}</PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          align="center"
          sideOffset={4}
          className={cx(
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
