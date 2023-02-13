import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: ["test/e2e/**/*.cy.{js,ts, jsx, tsx}"],
    supportFile: "cypress/support/component.{js,jsx,ts,tsx}",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    downloadsFolder: "cypress/downloads",
    fixturesFolder: "cypress/fixtures",
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
