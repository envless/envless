import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Check, ChevronsUpDown, GitBranch  } from 'lucide-react'

const people = [
  { id: 1, name: 'main' },
  { id: 2, name: 'development' },
  { id: 3, name: 'production' },
  { id: 4, name: 'update-env-keys' },
  { id: 5, name: 'dev-environment' },
  { id: 6, name: 'testing-environment' },
]

export default function BranchComboBox() {

 const [selected, setSelected] = useState(people[0])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )
        return (
 <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative flex items-center w-full rounded-md transition-color sm:text-xs">


            <div className="inline-flex items-center absolute sm:text-xs h-full overflow-hidden px-3 border-none">
             <GitBranch className="h-4 w-4 mr-2 shrink-0" />
             <span className='w-full text-light'>Base Branch</span>
            </div>

            <Combobox.Input
              className="w-full text-sm focus:outline-none !pl-28 overflow-hidden input-primary focus:ring-light"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(person) => person.name}
            />



             
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown
                className="h-4 w-4"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full border border-dark overflow-auto rounded-md bg-darker py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-xs">
              {filteredPeople.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-white">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-dark' : ''
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? '' : 'text-teal-400'
                            }`}
                          >
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>

        );
}
