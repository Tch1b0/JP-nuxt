// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
