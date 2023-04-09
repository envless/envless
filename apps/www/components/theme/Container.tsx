/**
 * Container component for creating a centered, full-width container.
 *
 * @param {object} props - The properties of the component.
 * @param {node} props.children - The child elements of the container.
 * @returns {JSX.Element} A section element with the appropriate styles applied.
 */
import clsx from "clsx";

interface ContainerProps {
  maxWidth?:
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
  maxWidth = "screen-xl",
  children,
  className,
}: ContainerProps) => {
  return (
    <section
      className={clsx("mx-auto px-5 xl:px-16", className, {
        "max-w-sm": maxWidth === "sm",
        "max-w-md": maxWidth === "md",
        "max-w-lg": maxWidth === "lg",
        "max-w-xl": maxWidth === "xl",
        "max-w-2xl": maxWidth === "2xl",
        "max-w-3xl": maxWidth === "3xl",
        "max-w-4xl": maxWidth === "4xl",
        "max-w-5xl": maxWidth === "5xl",
        "max-w-screen": maxWidth === "screen",
        "max-w-screen-xl": maxWidth === "screen-xl",
      })}
    >
      {children}
    </section>
  );
};

export default Container;
