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
import Footer from "./components/Footer";
import Head from "./components/Head";
import Header from "./components/Header";
import { leadingRelaxed, leadingTight } from "./components/theme";

type LockUserAccountProps = {
  headline: ReactElement;
  greeting: string;
  body: ReactElement;
};

const LockUserAccount: React.FC<LockUserAccountProps> = ({
  headline,
  greeting,
  body
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
              fontSize="24px"
              fontWeight={600}
              lineHeight={leadingTight}
              cssClass="paragraph"
            >
              {headline}
            </MjmlText>
            <MjmlSpacer height="16px" />
            <MjmlText
              cssClass="paragraph"
              padding="10px 0"
              fontSize="18px"
              lineHeight={leadingRelaxed}
            >
              <>{greeting}</>
            </MjmlText>
            <MjmlText
              cssClass="paragraph"
              padding="0"
              fontSize="18px"
              lineHeight={leadingRelaxed}
            >
              {body}
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
export default LockUserAccount;
