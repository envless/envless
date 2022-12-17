import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <div style={{ display: "flex" }}>
    <h1 style={{ color: "white", margin: "0 5px", fontSize: "2em" }}><span style={{ fontWeight: "bold" }}>envless</span></h1>
    <span style={{ color: "white", margin: "0 5px", fontSize: ".9em", justifyContent: "center", display: "flex", alignItems: "center", justifyItems: "middle", marginTop: "7px" }}>DOCS</span>
  </div>,
  logoLink: `/`,
  project: {
    link: 'https://github.com/envless/envless',
  },
  docsRepositoryBase: 'https://github.com/envless/docs',
  footer: {
    text: `${new Date().getFullYear()} © Envless`,
  },

  darkMode: true,
  nextThemes: {
    defaultTheme: "dark",
  },
}

export default config
