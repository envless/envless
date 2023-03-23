import { MjmlColumn, MjmlSection, MjmlText } from "mjml-react";
import { grayDark, textSm } from "./theme";

export default function Footer() {
  return (
    <MjmlSection cssClass="smooth">
      <MjmlColumn>
        <MjmlText
          cssClass="footer"
          padding="24px 24px 48px"
          fontSize={textSm}
          color={grayDark}
        >
          © {new Date().getFullYear()} Envless
        </MjmlText>
      </MjmlColumn>
    </MjmlSection>
  );
}
