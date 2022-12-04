import React from "react";

type InputProps = {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
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
