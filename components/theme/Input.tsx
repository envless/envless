/**
 * A functional react component for rendering a text input.
 *
 * @param {Object} props - The input props object.
 * @param {string} props.id - The id of the input element.
 * @param {string} props.name - The name of the input element.
 * @param {string} props.label - The label of the input element.
 * @param {string} props.type - The type of the input element.
 * @param {string} props.placeholder - The placeholder text of the input element.
 * @param {boolean} props.required - A boolean indicating whether the input is optional.
 * @param {boolean} props.error - A boolean indicating whether the input has an error.
 * @param {function} props.onChange - A function to be called when the input value changes.
 */

type InputProps = {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  error: boolean;
  onChange: () => void;
};

const Input = ({ ...props }: InputProps) => {
  const { id, name, label, type, placeholder, required, error, onChange } =
    props;
  return (
    <div className="my-6">
      {label && (
        <label htmlFor={id} className="block text-sm">
          {label}
        </label>
      )}

      <div className="my-2">
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          className="block w-full appearance-none rounded border border-zinc-700 bg-dark px-3 py-2 placeholder-gray-500 shadow-sm focus:border-zinc-700 focus:outline-none focus:ring-zinc-700 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default Input;
