import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

type Props = {
  button: React.ReactNode;
  items: { title: string; handleClick: () => void }[];
};

export default function Dropdown(props: Props) {
  const { button, items } = props;

  /**
   * A component for rendering the items in the dropdown menu
   * @returns The items in the dropdown menu
   */
  const DropDownItems = () => {
    // Return the items wrapped in a <React.Fragment> element
    return (
      <React.Fragment>
        {items.map((item, index) => {
          return (
            <Menu.Item key={index} as="div">
              <button
                className="w-full rounded p-2 text-left text-sm hover:bg-dark"
                onClick={item.handleClick}
              >
                {item.title}
              </button>
            </Menu.Item>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <Menu as="div" className="relative z-10 inline-block text-left">
      <Menu.Button>{button}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="div"
          className="absolute right-0 mt-2 w-60 origin-top-right rounded bg-darker shadow-xl shadow-black ring-1 ring-dark focus:outline-none"
        >
          <div className="m-3">
            <DropDownItems />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
