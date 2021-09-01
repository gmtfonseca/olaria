/// <reference types="Cypress" />
/// <reference types="../support" />

describe('FishCrud', () => {
  beforeEach(() => {
    cy.seedDb()
    cy.signin()
  })

  describe('FishList', () => {
    it('should display all fishes', () => {
      cy.visit('/#/fishes')
      cy.getBySel('fishListItem').should('have.length', 5)
    })

    it('should allow the user to search for a fish ', () => {
      cy.visit('/#/fishes')
      cy.getBySel('searchToggle').click()
      cy.getBySel('searchInput').type('CASCUDO')
      cy.getBySel('fishListItem').should('have.length', 1)
    })
  })

  describe('FishForm', () => {
    it('should initialize as an empty form', () => {
      cy.visit('/#/fishes/create')
      cy.getBySel('name').should('have.value', '')
      cy.getBySel('inactive').should('not.be.checked')
    })

    it('should display errors when saving ilegal form', () => {
      cy.visit('/#/fishes/create')
      cy.getBySel('save').click()
      cy.getBySel('fieldName')
        .find('.p-error')
        .should('be.visible')
        .and('contain', 'Nome inválido.')
    })
  })

  describe('FishList x FishForm', () => {
    it('should edit fish with new name', () => {
      cy.visit('/#/fishes')
      cy.getBySel('fishListItem').first().click()
      cy.location('hash').should('contains', 'edit')
      cy.getBySel('name').invoke('val').should('not.to.be.empty')
      cy.getBySel('name').clear().type('NEW NAME')
      cy.getBySel('save').click()
      cy.getBySel('toast').contains('Peixe editado com sucesso.')
      cy.location('hash').should('equal', '#/fishes')
    })

    it('should create new fish and delete it afterwards', () => {
      cy.visit('/#/fishes')
      cy.getBySel('actionCreate').click()
      cy.location('hash').should('equal', '#/fishes/create')
      cy.getBySel('name').type('NEW POND')
      cy.getBySel('save').click()
      cy.getBySel('toast').contains('Peixe criado com sucesso.')
      cy.location('hash').should('equal', '#/fishes')
      cy.getBySel('fishListItem').contains('NEW POND').click()
      cy.getBySel('name').should('have.value', 'NEW POND')
      cy.getBySel('delete').should('be.visible').click()
      cy.get('.p-confirm-dialog-accept').click()
      cy.getBySel('toast').contains('Peixe deletado com sucesso.')
      cy.location('hash').should('equal', '#/fishes')
    })
  })
})
