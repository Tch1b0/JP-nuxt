/* eslint-disable */
// @ts-ignore
Cypress.Commands.add("login", () => {
    cy.visit("/admin/login");
    cy.wait(200);
    cy.fixture("admin").then((credentials) => {
        cy.get("input").first().type(credentials["username"]);
        cy.get("input").last().type(credentials["password"]);
    });
    cy.get("button").click();
    cy.wait(500);
});

// @ts-ignore
Cypress.Commands.add("createPost", () => {
    // @ts-ignore
    cy.login();
    cy.wait(300);
    cy.visit("/");
    cy.wait(300);
    cy.get("button").first().click();
    cy.wait(500);
    cy.get("textarea").type("Test");
    cy.get("button").last().click();
    cy.wait(100);
    cy.url().should("not.include", "/admin/post");
    cy.wait(200);
    cy.visit("/");
    cy.wait(300);
    cy.contains("create").click();
    cy.wait(300);
    cy.get("button").last().click();
    cy.wait(200);
});
