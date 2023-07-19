import { clsx } from "clsx";
import { FieldValues, UseFormRegister } from "react-hook-form";

/**
 * A functional react component for rendering a text input.
 *
 * @param {InputProps} props - The input props object.
 * @param {string} props.name - The name of the input element.
 * @param {string} [props.label] - The label of the input element.
 * @param {string} [props.help] - The help text of the input element.
 * @param {any} props.register - A function that registers the input element.
 * @param {object} [props.errors] - An object containing the validation errors of the input element.
 * @param {boolean} [props.required=false] - A boolean indicating whether the input is required.
 * @param {boolean} [props.disabled=false] - A boolean indicating whether the input is disabled.
 * @param {boolean} [props.full=true] - A boolean indicating whether the input should take up the full width of the parent container.
 * @param {string} [props.type='text'] - The type of the input element.
 * @param {string} [props.type='inputMode'] - The inputMode of the input element.
 * @param {string} [props.placeholder] - The placeholder text of the input element.
 * @param {string} [props.defaultValue] - The default value of the input element.
 * @param {string} [props.className] - The class name of the input element.
 * @param {object} [props.validationSchema] - An object containing the validation rules for the input element.
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  help?: React.ReactNode | string;
  register: UseFormRegister<FieldValues>;
  errors?: object;
  required?: boolean;
  full?: boolean;
  defaultValue?: string;
  validationSchema?: object;
  iconRight?: React.ReactNode;
}

const Input = ({ ...props }: InputProps) => {
  const {
    name,
    label,
    help,
    register,
    errors,
    required,
    disabled,
    full,
    type,
    inputMode,
    placeholder,
    defaultValue,
    className,
    iconRight,
    validationSchema,
    ...restProps
  } = props;

  return (
    <div className="my-6">
      {label && (
        <label htmlFor={name} className="block text-sm">
          {label}
        </label>
      )}

      <div className="my-2">
        <div className="relative">
          <input
            {...restProps}
            id={name}
            type={type}
            inputMode={inputMode}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            defaultValue={defaultValue}
            {...register(name, validationSchema)}
            className={clsx(
              className,
              full && "w-full",
              " placeholder-light block appearance-none rounded border px-3 shadow-sm ring-1 focus:outline-none sm:text-sm",
              disabled
                ? "bg-light/30 ring-light/40 cursor-not-allowed"
                : "border-dark bg-darker ring-light/50 focus:border-dark focus:ring-light",
            )}
          />

          {iconRight && (
            <div className="absolute right-3 top-3">{iconRight}</div>
          )}
        </div>

        {help && <p className="text-light pt-1 text-xs">{help}</p>}

        {errors && errors[name] && (
          <p className="pt-1 text-xs text-red-400/75">{errors[name].message}</p>
        )}
      </div>
    </div>
  );
};

export default Input;

Input.defaultProps = {
  type: "text",
  required: false,
  disabled: false,
  full: false,
};
