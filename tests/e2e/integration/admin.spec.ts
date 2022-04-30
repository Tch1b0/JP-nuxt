/* eslint-disable */

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
        cy.createPost();
        // @ts-ignore
        cy.createPost();
    });

    xit("Edit Post", () => {
        // @ts-ignore
        cy.login();
        cy.wait(300);
        cy.visit("/");
        cy.wait(500);
        cy.get("button").last().click();
        cy.get("button").should("contain", "Edit").click();
        cy.get("textarea").type("2");
        cy.get(".grid > button").first().click();
        cy.wait(5000);
        cy.get("button").first().click();
        cy.wait(500);
        cy.url().should("not.include", "/admin/post");
        cy.contains("Test2");
    });

    xit("Delete Post", () => {
        // @ts-ignore
        cy.login();
        cy.wait(300);
        cy.visit("/");
        cy.wait(500);
        cy.get("button").should("contain", "read article").click();
        cy.get("button").should("contain", "Edit").click();
        cy.get("button").last().click();
        cy.wait(200);
        cy.url().should("not.include", "/admin/post");
    });
});
/* eslint-enable */
