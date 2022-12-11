import { ReactElement } from "react";
import Head from "./components/Head";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ButtonPrimary from "./components/ButtonPrimary";
import {
  leadingTight,
  leadingRelaxed,
  textBase,
  textSm,
  textLg,
} from "./components/theme";

import {
  Mjml,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlSpacer,
  MjmlDivider,
} from "mjml-react";

type MagicLinkProps = {
  headline: string;
  body: ReactElement;
  greeting: string;
  subText: string;
  buttonText?: string;
  buttonLink?: string;
};

const MagicLink: React.FC<MagicLinkProps> = ({
  headline,
  body,
  greeting,
  subText,
  buttonText,
  buttonLink,
}) => {
  return (
    <Mjml>
      <Head />
      <MjmlBody width={500}>
        <Header />
        <MjmlSection padding="0 24px" cssClass="smooth">
          <MjmlColumn>
            <MjmlDivider
              borderColor="#666"
              borderStyle="dotted"
              borderWidth="1px"
              padding="8px 0"
            ></MjmlDivider>
            <MjmlText
              padding="24px 0"
              fontSize={textLg}
              lineHeight={leadingTight}
              cssClass="paragraph"
            >
              {headline}
            </MjmlText>
            <MjmlSpacer height="16px" />
            <MjmlText
              cssClass="paragraph"
              padding="10px 0"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
            >
              <>{greeting}</>
            </MjmlText>
            <MjmlText
              cssClass="paragraph"
              padding="0"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
            >
              <>{body}</>
            </MjmlText>
            {buttonText && (
              <>
                <MjmlSpacer height="24px" />
                <ButtonPrimary
                  buttonLink={buttonLink || ""}
                  buttonText={buttonText}
                />
                <MjmlSpacer height="8px" />
              </>
            )}

            <MjmlText
              cssClass="paragraph"
              padding="12px 0"
              fontSize={textSm}
              lineHeight={leadingRelaxed}
            >
              <>{subText}</>
            </MjmlText>

            <MjmlDivider
              borderColor="#666"
              borderStyle="dotted"
              borderWidth="1px"
              padding="32px 0 0"
            ></MjmlDivider>
          </MjmlColumn>
        </MjmlSection>
        <Footer />
      </MjmlBody>
    </Mjml>
  );
};

export default MagicLink;
