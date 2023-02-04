import { MjmlButton } from "mjml-react";
import { black, grayLight, white } from "./theme";
import { borderBase, leadingTight, textBase } from "./theme";

type ButtonPrimaryProps = {
  buttonLink: string;
  buttonText: string;
};

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  buttonLink,
  buttonText,
}) => {
  return (
    <>
      <MjmlButton
        lineHeight={leadingTight}
        fontSize={textBase}
        height={32}
        padding="0"
        align="left"
        href={buttonLink}
        backgroundColor={black}
        color={grayLight}
        borderRadius={borderBase}
        cssClass="light-50-mode"
      >
        {buttonText}
      </MjmlButton>
      <MjmlButton
        lineHeight={leadingTight}
        fontSize={textBase}
        height={32}
        padding="0"
        align="left"
        href={buttonLink}
        backgroundColor={white}
        color={black}
        borderRadius={borderBase}
        cssClass="ddd1-mode"
      >
        {buttonText}
      </MjmlButton>
    </>
  );
};

export default ButtonPrimary;
