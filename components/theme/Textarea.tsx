import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { FieldValues, UseFormRegister } from "react-hook-form";

type TextareaTypes = {
  name: string;
  icon?: ReactNode;
  full?: boolean;
  iconActionClick?: () => void;
  register?: UseFormRegister<FieldValues>;
  validationSchema?: object;
  errors?: object;
} & ComponentProps<"textarea">;

export default function Textarea({
  name,
  full,
  icon,
  className,
  disabled,
  iconActionClick,
  register,
  validationSchema,
  errors,
  ...props
}: TextareaTypes) {
  return (
    <>
      <div className={clsx("relative flex items-center", full && "w-full")}>
        <textarea
          {...props}
          rows={1}
          disabled={disabled}
          {...(register ? { ...register(name, validationSchema) } : {})}
          className={clsx(
            className,
            "input-primary w-full scrollbar-thin scrollbar-track-dark scrollbar-thumb-darker",
          )}
        />

        {icon && (
          <button
            onClick={iconActionClick}
            className="absolute inset-y-0 right-0 mr-3 flex items-center rounded p-1"
          >
            {icon}
          </button>
        )}
      </div>

      {errors && errors[name] && (
        <p className="mt-2 text-xs text-red-400/75">{errors[name].message}</p>
      )}
    </>
  );
}
