/**
 * Container component for creating a centered, full-width container.
 *
 * @param {object} props - The properties of the component.
 * @param {node} props.children - The child elements of the container.
 * @returns {JSX.Element} A section element with the appropriate styles applied.
 */
const Container = ({ ...props }) => {
  const { children } = props;

  return (
    <section className="mx-auto max-w-screen-xl px-5 xl:px-16">
      {children}
    </section>
  );
};

export default Container;
