import axios from "axios";
import { clsx } from "clsx";
import { useState } from "react";
import { Input } from "@/components/base";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { RiArrowRightLine } from "react-icons/ri";

const Options = [
  {
    id: "personal",
    title: "Personal project",
    description: "Perfect for your OpenSource or your side projects.",
  },

  {
    id: "team",
    title: "Team project",
    description: "Perfect for team collaborating on one or multiple projects.",
  },
];

const EmptyState = ({ ...props }) => {
  const [team, setTeam] = useState("");
  const [project, setProject] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(Options[0]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(team, project);

    const res = await axios.post("/api/v1/projects", {
      team,
      project,
      personal: selectedOptions.id === "personal",
    });

    // const res = await fetch("/api/v1/projects", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     team: "team",
    //     project: "project",
    //     personal: false,
    //   })
    // });
  };

  return (
    <div className="mt-24 flex place-items-center content-center justify-center sm:mt-40">
      <div className="max-w-xl">
        <RadioGroup value={selectedOptions} onChange={setSelectedOptions}>
          <RadioGroup.Label className="text-2xl ">
            👋 Welcome to Envless
          </RadioGroup.Label>
          <RadioGroup.Description className="text-md mt-1 text-light">
            Let{"'"}s get started by creating a project.
          </RadioGroup.Description>

          <div className="mt-8 grid grid-cols-2 gap-y-6 gap-x-6">
            {Options.map((option) => (
              <RadioGroup.Option
                key={option.id}
                value={option}
                className={({ checked, active }) =>
                  clsx(
                    checked ? "border-transparent" : "border border-zinc-700",
                    active ? "border-teal-500 ring-2 ring-teal-500" : "",
                    "relative flex cursor-pointer rounded-lg bg-dark p-4 shadow-sm focus:outline-none",
                  )
                }
              >
                {({ checked, active }) => (
                  <>
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <RadioGroup.Label as="span" className="text-md block">
                          {option.title}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className="mt-1 flex items-center text-sm text-light"
                        >
                          {option.description}
                        </RadioGroup.Description>
                      </span>
                    </span>
                    <CheckCircleIcon
                      className={clsx(
                        !checked ? "invisible" : "",
                        "h-5 w-5 text-teal-400",
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={clsx(
                        active ? "border" : "border-2",
                        checked ? "border-teal-500" : "border-transparent",
                        "pointer-events-none absolute -inset-px rounded-lg",
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>

        <div className="mt-6 block">
          <form onSubmit={handleSubmit}>
            {selectedOptions.id === "team" && (
              <Input
                id="team"
                name="team"
                type="team"
                label="Team name"
                placeholder="Pied Piper Inc."
                required={true}
                onChange={(e: any) => setTeam(e.target.value)}
              />
            )}

            <Input
              id="project"
              name="project"
              type="project"
              label="Project name"
              placeholder="Project X"
              className="mt-4"
              required={true}
              onChange={(e: any) => setProject(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center rounded border border-transparent bg-gray-200 px-4 py-2 text-sm text-black shadow-sm hover:bg-lightest focus:outline-none"
              >
                Continue
                <RiArrowRightLine
                  className="ml-2 -mr-0.5 h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
