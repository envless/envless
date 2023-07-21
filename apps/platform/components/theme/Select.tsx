import { ReactElement } from "react";
import clsx from "clsx";

interface SelectProps {
  id: string;
  name: string;
  label?: string;
  register: any;
  validationSchema?: object;
  help?: string | ReactElement;
  errors?: object;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  defaultValue?: string;
  options: {
    value: string;
    label: string;
  }[];
}

const Select = ({
  id,
  name,
  help,
  label,
  errors,
  options,
  register,
  required,
  className,
  disabled,
  defaultValue,
  validationSchema,
}: SelectProps) => {
  return (
    <>
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          <span className="mb-2 mr-2 inline-block">{label}</span>
        </label>
      )}

      <select
        defaultValue={defaultValue}
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        {...register(name, validationSchema)}
        className={clsx(className, "input-primary")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {help && <div className="text-light pt-1 text-xs">{help}</div>}

      {errors && errors[name] != null && (
        <p className="pt-1 text-xs text-red-400/75">{errors[name]?.message}</p>
      )}
    </>
  );
};

export default Select;
