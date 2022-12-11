import { Paragraph, Button } from "@/components/theme";
import { PlusIcon } from "@heroicons/react/20/solid";
import { HiOutlineViewGridAdd } from "react-icons/hi";

export default function EmptyState() {
  return (
    <div className="-mt-24 flex h-screen w-full flex-col place-items-center items-center justify-center">
      <div className="text-center">
        <HiOutlineViewGridAdd className="m-3 mx-auto h-12 w-12" />
        <Paragraph size="2xl" color="lighter">
          You don{"'"}t have any projects yet.
        </Paragraph>
        <Paragraph color="light">
          Get started by creating a new project.
        </Paragraph>
        <p className="mt-1 text-sm text-gray-500"></p>
        <div className="mt-6 flex flex-col items-center justify-center">
          <Button href="/console/projects/new">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Project
          </Button>
        </div>
      </div>
    </div>
  );
}
