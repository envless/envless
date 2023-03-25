import { ReactElement } from "react";
import {
  Mjml,
  MjmlBody,
  MjmlColumn,
  MjmlDivider,
  MjmlSection,
  MjmlSpacer,
  MjmlText,
} from "mjml-react";
import ButtonPrimary from "./components/ButtonPrimary";
import Footer from "./components/Footer";
import Head from "./components/Head";
import Header from "./components/Header";
import {
  leadingRelaxed,
  leadingTight,
  textBase,
  textLg,
  textSm,
} from "./components/theme";

type DeleteProjectNoticeProps = {
  headline: ReactElement;
  body: ReactElement;
  greeting: string;
  buttonText?: string;
  buttonLink?: string;
};

const DeleteProjectNotice: React.FC<DeleteProjectNoticeProps> = ({
  headline,
  body,
  greeting,
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

export default DeleteProjectNotice;
