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
          width="80px"
          height="80px"
          align="center"
          src="https://s3.us-west-1.amazonaws.com/cdn.envless.dev/logo-dark.png"
          cssClass="logo"
        />
      </MjmlColumn>
    </MjmlSection>
  );
};

export default Header;
