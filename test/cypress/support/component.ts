import { mount } from "cypress/react18";
import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

/** @use: cy.mount(<MyComponent/>) **/
Cypress.Commands.add("mount", mount);
