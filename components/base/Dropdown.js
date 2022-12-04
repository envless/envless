import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Dropdown({ ...props }) {
  const { button, items } = props;

  const DropDownItems = () => {
    return items.map((item, index) => {
      return (
        <Menu.Item key={index} as="div">
          <button
            className="w-full rounded p-2 px-5 text-left text-sm hover:bg-[#222]"
            onClick={item.handleClick}
          >
            {item.title}
          </button>
        </Menu.Item>
      );
    });
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
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
          className="absolute right-0 mt-2 w-56 origin-top-right rounded shadow-xl shadow-black ring-1 ring-[#222] focus:outline-none"
        >
          <div className="m-3">
            <DropDownItems />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
