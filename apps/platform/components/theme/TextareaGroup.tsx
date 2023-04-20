import { ComponentProps, ReactNode, forwardRef } from "react";
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
  rows?: number;
} & ComponentProps<"textarea">;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaTypes>(
  function Textarea(
    {
      name,
      full,
      icon,
      className,
      disabled,
      iconActionClick,
      rows,
      register,
      validationSchema,
      errors,
      ...props
    },
    ref,
  ) {
    return (
      <>
        <div className={clsx("relative flex items-center", full && "w-full")}>
          <textarea
            ref={ref}
            {...props}
            rows={rows || 1}
            disabled={disabled}
            className={clsx(className, "input-primary scrollbar w-full")}
           autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
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
  },
);

export default Textarea;
