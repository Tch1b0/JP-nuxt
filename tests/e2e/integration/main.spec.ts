describe("Visit Site as a User", () => {
    it("Visit /", () => {
        cy.visit("/");
        cy.get("img").should("be.visible");
        cy.get(".grid").children("div").should("have.length", 3);
    });

    it("Visit /projects", () => {
        cy.visit("/projects");
        const gridChildren = cy.get(".grid .grid-cols-1").children("div");
        gridChildren.should("have.length.above", 3);
        cy.get("span").first().click();
        gridChildren.should("have.length.below", 3);
    });

    it("Visit article page", () => {
        cy.visit("/projects");
        cy.wait(400);
        cy.contains("read article").click();
        cy.url().should("include", "/projects/");
    });

    it("Visit /projects/topics", () => {
        cy.visit("/projects/topics");
        cy.wait(200);
        cy.get("span").should("have.length.above", 5);
        cy.get("span").first().click();

        // URI should start with /projects
        cy.url().should("include", "/projects");

        // URI should END with /projects, and not go on
        cy.url().should("not.include", "/projects/");
    });
});
