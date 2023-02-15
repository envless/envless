import { MjmlColumn, MjmlImage, MjmlSection } from "mjml-react";

type HeaderProps = {
  loose?: boolean;
};

const Header: React.FC<HeaderProps> = ({ loose }) => {
  return (
    <MjmlSection padding={loose ? "48px 0 40px" : "48px 0 24px"}>
      <MjmlColumn>
        <MjmlImage
          padding="0 16px 0"
          width="50px"
          height="50px"
          align="center"
          src="https://cdn.envless.dev/emails/logos/default.png"
          cssClass="logo"
        />
      </MjmlColumn>
    </MjmlSection>
  );
};

export default Header;
