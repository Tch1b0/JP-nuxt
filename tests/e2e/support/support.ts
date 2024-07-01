/* eslint-disable */
// @ts-ignore
Cypress.Commands.add("login", () => {
    cy.visit("/admin/login");
    cy.wait(1000);
    cy.fixture("admin").then((credentials) => {
        cy.get("input").first().type(credentials["username"]);
        cy.get("input").last().type(credentials["password"]);
    });
    cy.get("button").first().click();
    cy.wait(500);
});

// @ts-ignore
Cypress.Commands.add("createPost", () => {
    // @ts-ignore
    cy.login();
    cy.wait(300);
    cy.visit("/");
    cy.wait(300);
    cy.contains("create").first().click();
    cy.wait(500);
    cy.get("textarea").type("Test");
    cy.contains("Create Article").first().click();
    cy.wait(200);
});
