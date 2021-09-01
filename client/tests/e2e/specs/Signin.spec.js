/// <reference types="Cypress" />
/// <reference types="../support" />

describe('SigninForm', () => {
  beforeEach(() => {
    cy.seedDb()
  })

  it('should present invalid name error', () => {
    cy.visit('/#/signin')
    cy.getBySel('password').type(Cypress.env('PASSWORD'))
    cy.getBySel('signin').click()
    cy.getBySel('fieldName')
      .find('.p-error')
      .should('be.visible')
      .and('contain', 'Informe um usuário.')
  })

  it('should present invalid password error', () => {
    cy.visit('/#/signin')
    cy.getBySel('name').type(Cypress.env('USERNAME'))
    cy.getBySel('signin').click()
    cy.getBySel('fieldPassword')
      .find('.p-error')
      .should('be.visible')
      .and('contain', 'Informe uma senha.')
  })

  it('should redirect unauthenticated user to signin page', function () {
    cy.visit('/#/inventories')
    cy.location('href').should('contains', 'signin')
  })

  it('should authenticate and navigate to home page', () => {
    cy.visit('/#/signin')
    cy.getBySel('name').type(Cypress.env('USERNAME'))
    cy.getBySel('password').type(Cypress.env('PASSWORD'))
    cy.getBySel('signin').click()
    cy.location('href').should('contains', 'inventories')
  })
})
