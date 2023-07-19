import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { UserRole } from "@prisma/client";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";

interface RoleDropdownProps {
  roles: UserRole[];
  setSelectedRole: (role: UserRole) => void;
  selectedRole: UserRole;
  disabled: boolean;
}

export default function RoleDropDown({
  roles,
  selectedRole,
  setSelectedRole,
  disabled,
}: RoleDropdownProps) {
  const handleSelectRoleClick = (role: UserRole) => {
    setSelectedRole(role);
  };

  return (
    <Menu as="div" className="relative inline-block ">
      <div className="w-full">
        <Menu.Button
          disabled={disabled}
          className="border-dark bg-dark hover:bg-darker inline-flex w-full items-center truncate rounded border px-3 py-2 text-sm transition-colors duration-75 disabled:opacity-50 hover:disabled:text-current"
        >
          <div className="flex items-center space-x-2 justify-self-end">
            <span className="max-w-[100px] truncate text-sm font-semibold">
              {selectedRole}
            </span>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 shrink-0 justify-self-end"
            />
          </div>
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
        <Menu.Items className="bg-darker ring-dark absolute left-0 z-10 mt-1 w-56 origin-top-left rounded-md shadow-xl ring-2 focus:outline-none">
          <div className="border-dark border-b px-3 py-3 text-xs">
            <p className="font-semibold">Change user role</p>
          </div>
          <ul className="flex w-full flex-col text-xs">
            {roles.map((role) => (
              <Menu.Item
                as="button"
                key={role}
                onClick={() => handleSelectRoleClick(role)}
              >
                {({ active }) => (
                  <li
                    className={clsx(
                      "inline-flex w-full items-center justify-between px-3 py-2",
                      active ? "bg-dark" : "",
                    )}
                  >
                    <span className="truncate capitalize">{role}</span>
                    {role === selectedRole && (
                      <Check
                        className="h-4 w-4 shrink-0 text-teal-300"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                )}
              </Menu.Item>
            ))}
          </ul>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
