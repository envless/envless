import { Dispatch, Fragment, SetStateAction } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { Button, Input, Paragraph } from "@/components/theme";
import BaseModal from "../theme/BaseModal";

interface ConfirmationModalProps {
  title: string;
  description: string;
  onConfirmAction: () => void;
  cancelButtonText?: string;
  confirmButtonText?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors<FieldValues>;
  validationInputProps?: {
    name: string;
    placeholder: string;
    type: string;
    errorText: string;
    validationText: string;
  };
}

const ConfirmationModal = ({
  title,
  description,
  onConfirmAction,
  cancelButtonText = "Cancel",
  confirmButtonText = "Confirm",
  open,
  setOpen,
  validationInputProps,
  register,
  errors,
}: ConfirmationModalProps) => {
  return (
    <BaseModal isOpen={open} setIsOpen={setOpen} title={title}>
      <div className="flex flex-col items-stretch text-center">
        <Paragraph
          size="sm"
          className="mt-4 mb-3 text-center text-sm font-light"
        >
          {description}
        </Paragraph>
        {validationInputProps && (
          <Fragment>
            <Paragraph size="sm" className="rounded-md bg-red-500/40 px-2 py-1">
              {validationInputProps.validationText}
            </Paragraph>
            <Input
              type={validationInputProps.type}
              name={validationInputProps.name}
              register={register}
              required
              full
              errors={errors}
              className="mt-0 w-full rounded-md border border-gray-300 py-2 px-3"
              placeholder={validationInputProps.placeholder}
              validationSchema={{
                required: validationInputProps.errorText,
              }}
            />
          </Fragment>
        )}
        <div className="flex justify-center mt-3 gap-4">
          <Button variant="primary-outline" className="w-1/3" onClick={() => setOpen(false)}>
            {cancelButtonText}
          </Button>
          <Button variant="danger-outline" className="w-1/3" onClick={onConfirmAction}>
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmationModal;
