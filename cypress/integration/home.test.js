describe('Home Page', () => {

  beforeEach(() => {

    cy.fixture('courses.json').as("coursesJSON");

    cy.server(); // simulates/initializes mock backend server

    // Simulates return from an api call
    // use "@<name>" to access the payload we created with the same name
    cy.route('/api/courses', "@coursesJSON").as("courses");

    cy.visit('/'); // visits home page

  })

  it('should display a list of courses', () => {

    cy.contains("All Courses");

    // waiting for courses response to be simulated using the route command
    cy.wait('@courses');

    cy.get("mat-card").should("have.length", 9);

  });

  it('should display the advanced courses', () => {

    cy.get('.mat-tab-label').should("have.length", 2);

    cy.get('.mat-tab-label').last().click();

    cy.get('.mat-tab-body-active .mat-card-title').its('length').should("be.gt", 1);

    cy.get('.mat-tab-body-active .mat-card-title').first()
      .should('contain', "Angular Security Course");

  })
})
