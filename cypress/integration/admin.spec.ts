describe("Visit Site as an Admin", () => {
    it("Visit /admin unauthorized", () => {
        cy.visit("/admin");
        cy.url().should("include", "/admin/login");
    });

    it("Visit /admin/login", () => {
        cy.visit("/admin/login");
        cy.wait(100);
        cy.fixture("admin").then((credentials) => {
            cy.get("input").first().type(credentials["username"]);
            cy.get("input").last().type(credentials["password"]);
        });
        cy.get("button").click();
        cy.url().should("not.include", "/admin/login");
    });
});
