/// <reference types="Cypress" />
/// <reference types="../support" />

describe('PondCrud', () => {
  beforeEach(() => {
    cy.seedDb()
    cy.signin()
  })

  describe('PondList', () => {
    it('should display all ponds', () => {
      cy.visit('/#/ponds')
      cy.getBySel('pondListItem').should('have.length', 5)
    })

    it('should allow the user to search for a pond ', () => {
      cy.visit('/#/ponds')
      cy.getBySel('searchToggle').click()
      cy.getBySel('searchInput').type('05')
      cy.getBySel('pondListItem').should('have.length', 1)
    })
  })

  describe('PondForm', () => {
    it('should initialize as an empty form', () => {
      cy.visit('/#/ponds/create')
      cy.getBySel('name').should('have.value', '')
      cy.getBySel('inactive').should('not.be.checked')
    })

    it('should display errors when saving ilegal form', () => {
      cy.visit('/#/ponds/create')
      cy.getBySel('save').click()
      cy.getBySel('fieldName')
        .find('.p-error')
        .should('be.visible')
        .and('contain', 'Nome inválido.')
    })
  })

  describe('PondList x PondForm', () => {
    it('should edit pond with new name', () => {
      cy.visit('/#/ponds')
      cy.getBySel('pondListItem').first().click()
      cy.location('hash').should('contains', 'edit')
      cy.getBySel('name').invoke('val').should('not.to.be.empty')
      cy.getBySel('name').clear().type('NEW NAME')
      cy.getBySel('save').click()
      cy.getBySel('toast').contains('Açude editado com sucesso.')
      cy.location('hash').should('equal', '#/ponds')
    })

    it('should create new pond and delete it afterwards', () => {
      cy.visit('/#/ponds')
      cy.getBySel('actionCreate').click()
      cy.location('hash').should('equal', '#/ponds/create')
      cy.getBySel('name').type('NEW POND')
      cy.getBySel('save').click()
      cy.getBySel('toast').contains('Açude criado com sucesso.')
      cy.location('hash').should('equal', '#/ponds')
      cy.getBySel('pondListItem').contains('NEW POND').click()
      cy.getBySel('name').should('have.value', 'NEW POND')
      cy.getBySel('delete').should('be.visible').click()
      cy.get('.p-confirm-dialog-accept').click()
      cy.getBySel('toast').contains('Açude deletado com sucesso.')
      cy.location('hash').should('equal', '#/ponds')
    })
  })
})
