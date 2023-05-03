/**
 * Toggle is a React component that displays a name and an optional age.
 *
 * @param {ToggleProps} props - The props for the component.
 * @param {string} props.name - The name to display. This is required.
 * @param {boolean} props.checked - Whether the toggle is checked or not. This is required.
 * @param {any} props.register - The register function from react-hook-form. This is required.
 * @param {object} props.validateSchema - The validation schema from react-hook-form. This is optional.
 * @returns {JSX.Element} - A React element that displays the name.
 */

type ToggleProps = {
  name: string; // required
  checked?: boolean; // required
  register: any;
  validationSchema?: object;
};

const Toggle: React.FC<ToggleProps> = (props) => {
  const { name, checked, register, validationSchema } = props;
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        id={name}
        type="checkbox"
        name={name}
        defaultChecked={checked}
        className="peer sr-only"
        {...register(name, validationSchema)}
      />
      <div className="after:border-dark after:bg-darkest peer-checked:bg-lighter peer-checked:after:border-dark dark:border-dark dark:bg-light/40 peer h-5 w-9 rounded-full after:absolute after:left-[2px] after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:transition-all after:content-[''] after:hover:scale-110 peer-checked:after:translate-x-full "></div>
    </label>
  );
};

export default Toggle;
