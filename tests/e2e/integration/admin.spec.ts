describe("Visit Site as an Admin", () => {
    it("Visit /admin unauthorized", () => {
        cy.visit("/admin");
        cy.url().should("include", "/admin/login");
    });

    it("Visit /admin/login", () => {
        cy.visit("/admin/login");
        cy.wait(200);
        cy.fixture("admin").then((credentials) => {
            cy.get("input").first().type(credentials["username"]);
            cy.get("input").last().type(credentials["password"]);
        });
        cy.get("button").click();
        cy.wait(500);
        cy.url().should("not.include", "/admin/login");
    });

    it("Visit /admin", () => {
        // @ts-ignore
        cy.login();
        cy.wait(300);
        cy.get("h3").should("contain", "Welcome back,");
        cy.get("canvas").should("be.visible");
    });

    it("Create Post", () => {
        // @ts-ignore
        cy.login();
        cy.wait(300);
        cy.visit("/");
        cy.wait(100);
        cy.get("button").first().click();
        cy.wait(500);
        cy.get("input").type("Test");
        cy.find('button[value="Create Post"]').click();
        cy.wait(100);
        cy.url().should("not.include", "/admin/post");
    });
});
