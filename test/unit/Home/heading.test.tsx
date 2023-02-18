import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import Hero from "@/components/home/Hero";

describe("Home", () => {
  it("Should render a Heading", () => {
    const headerText = ".envless";

    const { getByRole } = render(<Hero header={headerText} />);
    const heading = getByRole("heading", {
      name: headerText,
    });

    expect(heading);
  });
});
