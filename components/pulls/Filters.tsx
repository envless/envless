import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { key: "createdAt.asc", value: "Newest" },
  { key: "createdAt.desc", value: "Oldest" },
  { key: "updatedAt.asc", value: "Recently updated" },
  { key: "updatedAt.desc", value: "Least recently updated" },
];

const statusOptions = [
  { key: "open", value: "Open" },
  { key: "closed", value: "Closed" },
  { key: "merged", value: "Merged" },
];

const authorsOptions = [
  { id: 111, label: "John Doe" },
  { id: 222, label: "Jane Doe" },
  { id: 333, label: "Will Smith" },
];

const selectedOptions = {
  author: { id: 111, name: "John Doe" },
  status: [{ value: "open", label: "Open" }],
  sort: { name: "Newest", key: "createdAt.asc" },
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Filter = (key, option) => {
  return (
    <span
      key={option.id || option.key || option.value}
      className="m-1 inline-flex items-center rounded-full border border-dark-700 bg-dark-900 py-1.5 pl-3 pr-2 text-xs text-lll2"
    >
      <span>
        {key}: {option.value || option.name}
      </span>
      <button
        type="button"
        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-light-50 hover:bg-dark-700 hover:text-lll2"
      >
        <span className="sr-only">
          Remove filter for {option.value || option.name}
        </span>
        <svg
          className="h-2 w-2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 8 8"
        >
          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    </span>
  );
};

export default function Filters() {
  return (
    <div className="">
      {/* Filters */}
      <section aria-labelledby="filter-heading">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="border-b border-dark-700 pb-4">
          <div className="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Sort */}
            <Menu
              as="div"
              className="relative mr-6 hidden text-left sm:inline-block"
            >
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-light-50 hover:text-lll2">
                  Sort
                  <ChevronDown
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-light-50 group-hover:text-lll2"
                    aria-hidden="true"
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
                <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-dark-800 shadow-2xl ring-2 ring-light-50 ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.value}>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              console.log("Sort by", option.key);
                            }}
                            className={classNames(
                              active ? "w-full bg-dark-700 text-left" : "",
                              "block px-4 py-2 text-xs text-lll2",
                            )}
                          >
                            {option.value}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Status */}
            <Menu
              as="div"
              className="relative mr-6 hidden text-left sm:inline-block"
            >
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-light-50 hover:text-lll2">
                  Status
                  <ChevronDown
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-light-50 group-hover:text-lll2"
                    aria-hidden="true"
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
                <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-dark-800 shadow-2xl ring-2 ring-light-50 ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {statusOptions.map((option) => (
                      <Menu.Item key={option.key}>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              console.log("Sort by", option.key);
                            }}
                            className={classNames(
                              active ? "w-full bg-dark-700 text-left" : "",
                              "block px-4 py-2 text-xs text-lll2",
                            )}
                          >
                            {option.value}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Author */}
            <div className="w-full">
              <input
                type="text"
                className="input-primary float-right max-w-md py-1.5 text-sm"
                placeholder="Search by author's name"
              />
            </div>
          </div>
        </div>

        {/* Active filters */}
        <div className="bg-dark-800/25">
          <div className="mx-auto max-w-7xl py-3 px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
            <h3 className="text-sm font-medium text-light-50">
              Filters
              <span className="sr-only">, active</span>
            </h3>

            <div
              aria-hidden="true"
              className="hidden h-5 w-px bg-light-50 sm:ml-4 sm:block"
            />

            <div className="mt-2 sm:mt-0 sm:ml-4">
              <div className="-m-1 flex flex-wrap items-center">
                {Object.keys(selectedOptions).map((key) => {
                  const option = selectedOptions[key];

                  if (option && Array.isArray(option)) {
                    return (
                      <div key={key}>{option.map((o) => Filter(key, o))}</div>
                    );
                  } else {
                    return Filter(key, option);
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
