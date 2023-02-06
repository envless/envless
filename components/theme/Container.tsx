/**
 * Container component for creating a centered, full-width container.
 *
 * @param {object} props - The properties of the component.
 * @param {node} props.children - The child elements of the container.
 * @returns {JSX.Element} A section element with the appropriate styles applied.
 */
import clsx from "clsx";

interface ContainerProps {
  maxW?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "screen"
    | "screen-xl";
  children: React.ReactNode;
  className?: string;
}
const Container = ({
  maxW = "screen-xl",
  children,
  className,
}: ContainerProps) => {
  return (
    <section
      className={clsx("mx-auto px-5 xl:px-16", 'max-w-' + maxW, className)}
    >
      {children}
    </section>
  );
};

export default Container;
