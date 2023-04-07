/**
 * Example is a React component that displays a name and an optional age.
 *
 * @param {ExampleProps} props - The props for the component.
 * @param {string} props.name - The name to display. This is required.
 * @param {number} [props.age] - The age of the person, if available. This is optional.
 * @returns {JSX.Element} - A React element that displays the name.
 */

type ExampleProps = {
  name: string; // required
  age?: number; // optional
};

const Example: React.FC<ExampleProps> = (props) => {
  return <div>{props.name}</div>;
};

export default Example;
