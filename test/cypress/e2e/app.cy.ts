describe("Home Page", () => {
  it("should navigate to the about page", () => {
    // Start from the index page
    cy.visit("/");

    // Find a link with an href attribute containing "blog" and click it
    cy.get('a[href*="blog"]').click();

    // The new url should include "/about"
    cy.url().should("include", "/about");
  });
});
