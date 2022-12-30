import { Cross1Icon } from "@radix-ui/react-icons";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import cx from "classnames";
import React from "react";

interface Props {
  button: React.ReactNode;
  children: React.ReactNode;
}

const items = [
  {
    id: "width",
    label: "Width",
    defaultValue: "100%",
  },
  {
    id: "max-width",
    label: "Max. width",
    defaultValue: "300px",
  },
  {
    id: "height",
    label: "Height",
    defaultValue: "25px",
  },
  {
    id: "max-height",
    label: "Max. height",
    defaultValue: "none",
  },
];

const Popover = (props: Props) => {
  const { button, children } = props;

  return (
    <div className="relative inline-block text-left">
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          {button}
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Content
          align="center"
          sideOffset={4}
          className={cx(
            "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
            "w-56 rounded shadow-md md:w-56",
            "bg-darker",
            "shadow-xl shadow-black ring-2 ring-dark focus:outline-none"
          )}
        >
          <PopoverPrimitive.Arrow className="fill-current text-dark" />

          { children }

        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    </div>
  );
};

export default Popover;
