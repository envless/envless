/**
 * A functional react component for rendering a text input.
 *
 * @param {InputProps} props - The input props object.
 * @param {string} props.name - The name of the input element.
 * @param {string} [props.label] - The label of the input element.
 * @param {any} props.register - A function that registers the input element.
 * @param {object} [props.errors] - An object containing the validation errors of the input element.
 * @param {boolean} [props.required=false] - A boolean indicating whether the input is required.
 * @param {boolean} [props.disabled=false] - A boolean indicating whether the input is disabled.
 * @param {string} [props.type='text'] - The type of the input element.
 * @param {string} [props.placeholder] - The placeholder text of the input element.
 * @param {string} [props.defaultValue] - The default value of the input element.
 * @param {object} [props.validationSchema] - An object containing the validation rules for the input element.
 */

interface InputProps {
  name: string;
  label?: string;
  register: any;
  errors?: object;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  validationSchema?: object;
}

const Input = ({ ...props }: InputProps) => {
  const {
    name,
    label,
    register,
    errors,
    required,
    type,
    placeholder,
    defaultValue,
    validationSchema,
  } = props;

  return (
    <div className="my-6">
      {label && (
        <label htmlFor={name} className="block text-sm">
          {label}
        </label>
      )}

      <div className="my-2">
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          {...register(name, validationSchema)}
          className="block w-full appearance-none rounded border border-zinc-700 bg-dark px-3 py-2 placeholder-gray-500 shadow-sm focus:border-zinc-700 focus:outline-none focus:ring-zinc-700 sm:text-sm"
        />

        {errors && errors[name]?.type === "required" && (
          <span className="text-xs text-red-400/75">
            {errors[name]?.message}
          </span>
        )}

        {errors && errors[name]?.type === "minLength" && (
          <span className="text-xs text-red-400/75">
            {errors[name]?.message}
          </span>
        )}

        {errors && errors[name]?.type === "pattern" && (
          <span className="text-xs text-red-400/75">
            {errors[name]?.message}
          </span>
        )}

        {errors && errors[name]?.type === "custom" && (
          <span className="text-xs text-red-400/75">
            {errors[name]?.message}
          </span>
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
};
