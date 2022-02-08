describe("Visit Site as a User", () => {
    it("Visit /", () => {
        cy.visit("/");
        cy.get("img").should("be.visible");
        cy.get(".grid").children("div").should("have.length", 3);
    });

    it("Visit /projects", () => {
        cy.visit("/projects");
        const gridChildren = cy.get(".grid").children("div");
        gridChildren.should("have.length.above", 3);
        cy.get("span").first().click();
        gridChildren.should("have.length.below", 3);
    });

    it("Visit aritcle page", () => {
        cy.visit("/projects");
        cy.wait(800);
        cy.contains("read article").click();
        cy.url().should("include", "/projects/");
    });

    it("Visit /projects/topics", () => {
        cy.visit("/projects/topics");
        cy.wait(500);
        cy.get("span").should("have.length.above", 5);
        cy.get("span").first().click();

        // URI should start with /projects
        cy.url().should("include", "/projects");

        // URI should END with /projects, and not go on
        cy.url().should("not.include", "/projects/");
    });
});
