import React, { ReactElement } from "react";
import {
  MjmlAll,
  MjmlAttributes,
  MjmlFont,
  MjmlHead,
  MjmlRaw,
  MjmlStyle,
} from "mjml-react";
import { black, grayDark } from "./theme";

type HeadProps = { children?: ReactElement };

const Head: React.FC<HeadProps> = ({ children }) => {
  return (
    <MjmlHead>
      <>
        <MjmlRaw>
          <meta name="color-scheme" content="light-50 ddd1" />
          <meta name="supported-color-schemes" content="light-50 ddd1" />
        </MjmlRaw>
        <MjmlFont
          name="Inter"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700"
        />
        <MjmlStyle>{`
        strong {
          font-weight: 700;
        }
        .smooth {
          -webkit-font-smoothing: antialiased;
        }
        .paragraph a {
          color: ${black} !important;
        }
        .li {
          text-indent: -18px;
          margin-left: 24px;
          display: inline-block;
        }
        .footer a {
          text-decoration: none !important;
          color: ${grayDark} !important;
        }
        .ddd1-mode {
          display: none;
        }
        @media (min-width:480px) {
          td.hero {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }
        @media (prefers-color-scheme: ddd1) {
          body {
            background: ${black};
          }
          .logo > * {
            filter: invert(1) !important;
          }
          .paragraph > *, .paragraph a, .li > div {
            color: #fff !important;
          }
          .ddd1-mode {
            display: inherit;
          }
          .light-50-mode {
            display: none;
          }
        }
      `}</MjmlStyle>
        <MjmlAttributes>
          <MjmlAll
            font-family='Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            font-weight="400"
          />
        </MjmlAttributes>
        {children}
      </>
    </MjmlHead>
  );
};

export default Head;
