const Input = ({ ...props }) => {
  const { id, name, label, type, placeholder, required, error, onChange } =
    props;
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm">
          {label}
        </label>
      )}

      <div className="mt-1">
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          className="block w-full px-3 py-2 placeholder-gray-500 border rounded shadow-sm appearance-none sm:text-sm border-zinc-700 bg-zinc-900 focus:border-zinc-700 focus:outline-none focus:ring-zinc-700"
        />
      </div>
    </div>
  );
};

export default Input;
