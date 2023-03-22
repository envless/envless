import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { UserRole } from "@prisma/client";
import clsx from "clsx";
import { Check, ChevronDown, UserCog } from "lucide-react";

interface MemeberDropdownProps {
  roles: UserRole[];
  setSelectedRole: (role: UserRole) => void;
  selectedRole: UserRole;
  loading: boolean;
}

export default function MemberDropDown({
  roles,
  selectedRole,
  setSelectedRole,
  loading,
}: MemeberDropdownProps) {
  const handleSelectRoleClick = (role: UserRole) => {
    setSelectedRole(role);
  };

  return (
     <Menu as="div" className="relative mt-4 inline-block w-full max-w-[200px]">
      <div className="w-full">
        <Menu.Button disabled={loading} className="inline-flex w-full items-center truncate rounded border border-dark bg-dark px-3 py-2 text-sm transition-colors duration-75 hover:bg-darker disabled:opacity-50 hover:disabled:text-current">
          <div className="flex items-center">
            <UserCog className="mr-2 h-4 w-4 shrink-0" />
            <span className="mr-2 block text-xs text-light">Role</span>
          </div>

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
        <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-darker shadow-xl ring-2 ring-dark focus:outline-none z-10">
          <div className="border-b border-dark px-3 py-3 text-xs">
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
