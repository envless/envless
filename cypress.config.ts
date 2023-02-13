import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    specPattern: ["test/cypress/**/*.cy.{js,ts, jsx, tsx}"],
    supportFile: "test/cypress/support/component.{js,jsx,ts,tsx}",
    screenshotsFolder: "test/cypress/screenshots",
    videosFolder: "test/cypress/videos",
    downloadsFolder: "test/cypress/downloads",
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
