describe("Home Page", () => {
  it("should navigate to the about page", () => {
    cy.visit("/");

    cy.get('a[href*="blog"]').click();

    cy.url().should("include", "/about");
  });
});
