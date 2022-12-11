import Nav from "@/components/console/Nav";
import { Container } from "@/components/theme";
/**
 * Console wrapper component to render shared nav, children and footer
 *
 * @param {object} props - The properties of the component.
 * @param {object} props.currentUser - Current user object.
 * @param {node} props.children - The child elements of the container.
 * @returns {JSX.Element} A section element with the appropriate styles applied.
 */
const Wrapper = ({ ...props }) => {
  const { currentUser, children } = props;

  return (
    <>
      <Container>
        <Nav currentUser={currentUser} />
      </Container>

      <Container>{children}</Container>
    </>
  );
};

export default Wrapper;
