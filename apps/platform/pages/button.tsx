import { PlusIcon } from "lucide-react";
import ButtonV2 from "@/components/theme/ButtonV2";

export default function Button() {
  return (
    <>
      <div className="my-4 grid grid-cols-5 place-items-center gap-2 px-10 py-10">
        <div className="flex flex-col gap-2">
          <p>Primary Variant</p>
          <ButtonV2 loading={false}>Save Changes</ButtonV2>
          <ButtonV2 loading={true}>Save Changes</ButtonV2>
        </div>

        <div className="flex flex-col gap-2">
          <p>Secondary Variant</p>
          <ButtonV2 variant="secondary" loading={false}>
            Save Changes
          </ButtonV2>
          <ButtonV2 variant="secondary" loading={true}>
            Save Changes
          </ButtonV2>
        </div>

        <div className="flex flex-col gap-2">
          <p>Primary Outlined Variant</p>
          <ButtonV2 variant="primary-outline" loading={false}>
            Save Changes
          </ButtonV2>
          <ButtonV2 variant="primary-outline" loading={true}>
            Save Changes
          </ButtonV2>
        </div>

        <div className="flex flex-col gap-2">
          <p>Danger Variant</p>
          <ButtonV2 variant="danger" loading={false}>
            Save Changes
          </ButtonV2>
          <ButtonV2 variant="danger" loading={true}>
            Save Changes
          </ButtonV2>
        </div>

        <div className="flex flex-col gap-2">
          <p>Danger Outlined Variant</p>
          <ButtonV2 variant="danger-outline" loading={false}>
            Save Changes
          </ButtonV2>
          <ButtonV2 variant="danger-outline" loading={true}>
            Save Changes
          </ButtonV2>
        </div>
      </div>

      <div className="my-4 grid grid-cols-5 place-items-center gap-2 px-10 py-10">
        <div className="flex flex-col gap-2">
          <p>Primary Variant with Left Icon</p>
          <ButtonV2
            leftIcon={<PlusIcon className="mr-2 h-5 w-5" />}
            loading={true}
          >
            Save Changes
          </ButtonV2>
          <ButtonV2
            leftIcon={<PlusIcon className="mr-2 h-5 w-5" />}
            loading={false}
          >
            Save Changes
          </ButtonV2>
        </div>

        <div className="flex flex-col gap-2">
          <p>Secondary Variant with Left Icon</p>
          <ButtonV2
            leftIcon={<PlusIcon className="mr-2 h-5 w-5" />}
            variant="secondary"
            loading={false}
          >
            Save Changes
          </ButtonV2>
          <ButtonV2
            leftIcon={<PlusIcon className="mr-2 h-5 w-5" />}
            variant="secondary"
            loading={true}
          >
            Save Changes
          </ButtonV2>
        </div>

        <div className="flex flex-col gap-2">
          <p>Primary Outlined Variant with Left Icon</p>
          <ButtonV2
            leftIcon={<PlusIcon className="mr-2 h-5 w-5" />}
            variant="primary-outline"
            loading={false}
          >
            Save Changes
          </ButtonV2>
          <ButtonV2
            leftIcon={<PlusIcon className="mr-2 h-5 w-5" />}
            variant="primary-outline"
            loading={true}
          >
            Save Changes
          </ButtonV2>
        </div>

        <div className="flex flex-col gap-2">
          <p>Danger Variant with Left Icon</p>
          <ButtonV2
            leftIcon={<PlusIcon className="mr-2 h-5 w-5" />}
            variant="danger"
            loading={false}
          >
            Save Changes
          </ButtonV2>
          <ButtonV2
            leftIcon={<PlusIcon className="mr-2 h-5 w-5" />}
            variant="danger"
            loading={true}
          >
            Save Changes
          </ButtonV2>
        </div>

        <div className="flex flex-col gap-2">
          <p>Danger Outlined Variant with Left Icon</p>
          <ButtonV2
            leftIcon={<PlusIcon className="mr-2 h-5 w-5" />}
            variant="danger-outline"
            loading={false}
          >
            Save Changes
          </ButtonV2>
          <ButtonV2
            leftIcon={<PlusIcon className="mr-2 h-5 w-5" />}
            variant="danger-outline"
            loading={true}
          >
            Save Changes
          </ButtonV2>
        </div>
      </div>
    </>
  );
}
