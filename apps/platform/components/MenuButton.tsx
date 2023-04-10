import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MoreVertical } from "lucide-react";

export interface MenuButtonAction {
  label: string;
  icon?: React.ReactElement;
  onClick: (arg: any) => any;
}

export interface MenuButtonProps {
  disabled?: boolean;
  actions: MenuButtonAction[];
}

export default function MenuButton({ disabled, actions }: MenuButtonProps) {
  return (
    <Menu as="div" className="relative inline-block">
      <div className="w-full">
        <Menu.Button
          disabled={disabled}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-100 focus-within:bg-white/25 hover:bg-white/10 focus:bg-white/25 active:bg-white/25 disabled:opacity-50"
        >
          <MoreVertical
            aria-hidden="true"
            className="shrink-0 justify-self-end"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="bg-darker ring-dark absolute top-3/4 right-0 z-10 mt-1 flex w-auto min-w-[200px] origin-top-left flex-col rounded-md shadow-xl ring-2 focus:outline-none">
          {actions.map((action, index) => (
            <Menu.Item
              key={index}
              as="button"
              onClick={action.onClick}
              className="hover:bg-darkest active:bg-dark/50 inline-flex w-full items-center gap-2 px-4 py-3"
            >
              <span className="mr-2">{action.icon}</span>
              <span className="truncate capitalize">{action.label}</span>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
