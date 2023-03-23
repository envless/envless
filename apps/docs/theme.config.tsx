import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: (
    <svg
      width="40"
      height="40"
      viewBox="0 0 2600 2600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2225 1311C2225 1068.33 2128.6 835.592 1957 663.997C1785.41 492.401 1552.67 395.999 1310 395.999C1067.33 395.999 834.593 492.401 662.997 663.996C491.402 835.592 395 1068.33 395 1311L1310 1311H2225Z"
        stroke="currentColor"
        strokeWidth="302"
      />
      <path
        d="M512.287 1766.95C594.182 1905.12 711.004 2019.3 851.011 2098.01C991.019 2176.72 1149.28 2217.19 1309.88 2215.35C1470.49 2213.51 1627.78 2169.43 1765.95 2087.54C1904.12 2005.64 2018.3 1888.82 2097.01 1748.81"
        stroke="currentColor"
        strokeWidth="302"
      />
    </svg>
  ),
  logoLink: `https://envless.dev`,
  project: {
    link: "https://github.com/envless/envless",
  },
  chat: {
    link: "https://twitter.com/envless",
    icon: (
      <svg width="28" height="28" viewBox="0 0 1024 1024">
        <path
          fill="currentColor"
          d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm215.3 337.7c.3 4.7.3 9.6.3 14.4c0 146.8-111.8 315.9-316.1 315.9c-63 0-121.4-18.3-170.6-49.8c9 1 17.6 1.4 26.8 1.4c52 0 99.8-17.6 137.9-47.4c-48.8-1-89.8-33-103.8-77c17.1 2.5 32.5 2.5 50.1-2a111 111 0 0 1-88.9-109v-1.4c14.7 8.3 32 13.4 50.1 14.1a111.13 111.13 0 0 1-49.5-92.4c0-20.7 5.4-39.6 15.1-56a315.28 315.28 0 0 0 229 116.1C492 353.1 548.4 292 616.2 292c32 0 60.8 13.4 81.1 35c25.1-4.7 49.1-14.1 70.5-26.7c-8.3 25.7-25.7 47.4-48.8 61.1c22.4-2.4 44-8.6 64-17.3c-15.1 22.2-34 41.9-55.7 57.6z"
        ></path>
      </svg>
    ),
  },
  docsRepositoryBase: "https://github.com/envless/docs/blob/main",
  footer: {
    text: `${new Date().getFullYear()} © Envless`,
  },

  darkMode: true,
  primaryHue: 178,
  nextThemes: {
    defaultTheme: "dark",
  },

  useNextSeoProps() {
    return {
      titleTemplate: "%s – Envless Docs",
    };
  },
};

export default config;
