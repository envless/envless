import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useZodForm } from "@/hooks/useZodForm";
import { z } from "zod";
import { BaseInput, Button, Paragraph } from "@/components/theme";
import BaseModal from "../theme/BaseModal";
import Form from "../theme/Form";

interface ConfirmationModalProps {
  title: string;
  descriptionComponent: ReactNode;
  onConfirmAction: () => void;
  cancelButtonText?: string;
  confirmButtonText?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  validationInputProps?: {
    name: string;
    placeholder: string;
    label: string;
    type: string;
    errorText: string;
    validationText: string;
  };
}

const ConfirmationModal = ({
  title,
  descriptionComponent,
  onConfirmAction,
  confirmButtonText = "Confirm",
  open,
  setOpen,
  validationInputProps,
}: ConfirmationModalProps) => {
  const confirmationSchema = z.object({
    name: z.string().optional(),
  });

  const form = useZodForm({
    schema: confirmationSchema,
  });

  const [isDisabled, setIsDisabled] = useState(true);

  // This is not working and is subject to change.
  /*
  useEffect(() => {
    if (validationInputProps) {
      form.setFocus();
    }
  }, [form.setFocus, validationInputProps]);
        */

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (
        value[validationInputProps?.name as string] ===
        String(validationInputProps?.validationText)
      ) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  return (
    <BaseModal isOpen={open} setIsOpen={setOpen} title={title}>
      <div className="flex w-full flex-col items-center">
        <div className="mb-2 w-full rounded-md bg-dark py-1 px-2 text-left text-xs">
          <p className="font-semibold text-amber-600">
            Unexpected bad things will happen if you don't read this!
          </p>
        </div>
        <Paragraph size="sm" color="light" className="my-3">
          {descriptionComponent}
        </Paragraph>
        {validationInputProps && (
          <Form form={form} className="w-full" onSubmit={onConfirmAction}>
            <label
              htmlFor={validationInputProps.name}
              className="my-2 block w-full text-left text-xs font-semibold text-lighter"
            >
              {validationInputProps.label}
            </label>
            <BaseInput
              full
              type={validationInputProps.type}
              id={validationInputProps.name}
              placeholder={validationInputProps.placeholder}
              {...form.register("name")}
            />

            {form.formState.errors?.name && (
              <p className="mt-1 text-xs text-red-400/75">
                {form.formState.errors.name.message}
              </p>
            )}
          </Form>
        )}
        <div className="mt-6 flex w-full justify-center gap-2">
          <Button
            variant="danger-outline"
            className="w-full"
            type="submit"
            disabled={isDisabled}
            onClick={onConfirmAction}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmationModal;
