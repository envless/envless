import { ReactNode } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

interface FormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  children?: ReactNode | ReactNode[];
  onSubmit: SubmitHandler<TFieldValues>;
  className?: string;
}

export default function Form<T extends FieldValues>(props: FormProps<T>) {
  const { form, onSubmit, children, className } = props;

  return (
    <FormProvider {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
}
