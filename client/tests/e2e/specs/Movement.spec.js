/// <reference types="Cypress" />
/// <reference types="../support" />

describe('MovementCrud', () => {
  beforeEach(() => {
    cy.seedDb()
    cy.signin()
  })

  describe('MovementList', () => {
    it('should display all movements', () => {
      cy.visit('/#/movements')
      cy.getBySel('movementListItem').should('have.length', 4)
    })

    it('should allow the user to search for a movement by fish name ', () => {
      cy.visit('/#/movements')
      cy.getBySel('searchToggle').click()
      cy.getBySel('searchInput').type('CASCUDO')
      cy.getBySel('movementListItem').should('have.length', 2)
    })

    it('should allow the user to filter ', () => {
      cy.visit('/#/movements')
      cy.getBySel('filter').click()
      cy.getBySel('pond').type('01 (800)')
      cy.get('.p-autocomplete-item').first().click()
      cy.getBySel('applyFilter').click()
      cy.getBySel('movementListItem').should('have.length', 2)
    })
  })

  describe('MovementForm', () => {
    it('should initialize as an empty form', () => {
      cy.visit('/#/movements/create')
      cy.getBySel('datetime').should(
        'have.value',
        new Date().toLocaleDateString('pt-BR')
      )
      cy.getBySel('fish').should('have.value', '')
      cy.getBySel('pond').should('have.value', '')
      cy.getBySel('actionIn').should('be.checked')
      cy.getBySel('quantity').should('have.value', '')
      cy.getBySel('notes').should('have.value', '')
    })

    it('should display errors when saving ilegal form', () => {
      cy.visit('/#/movements/create')
      cy.getBySel('save').click()
      cy.getBySel('fieldFish')
        .find('.p-error')
        .should('be.visible')
        .and('contain', 'Peixe inválido.')

      cy.getBySel('fieldPond')
        .find('.p-error')
        .should('be.visible')
        .and('contain', 'Açude inválido.')

      cy.getBySel('fieldQuantity')
        .find('.p-error')
        .should('be.visible')
        .and('contain', 'Quantidade inválida.')
    })
  })

  describe('MovementList x MovementForm', () => {
    it('should edit movement with new quantity', () => {
      cy.visit('/#/movements')
      cy.getBySel('movementListItem').first().click()
      cy.location('hash').should('contains', 'edit')
      cy.getBySel('quantity').invoke('val').should('not.to.be.empty')
      cy.getBySel('quantity').clear().type(11)
      cy.getBySel('save').click()
      cy.getBySel('toast').contains('Movimento editado com sucesso.')
      cy.location('hash').should('equal', '#/movements')
    })

    it('should create new movement and delete it afterwards', () => {
      cy.visit('/#/movements')
      cy.getBySel('actionCreate').click()
      cy.location('hash').should('equal', '#/movements/create')
      cy.getBySel('fish').type('CAUDA PP')
      cy.get('.p-autocomplete-item').first().click()
      cy.getBySel('pond').type('01 (800)')
      cy.get('.p-autocomplete-item').first().click()
      cy.getBySel('quantity').type(15)
      cy.getBySel('notes').type('Test')
      cy.getBySel('save').click()
      cy.getBySel('toast').contains('Movimento criado com sucesso.')
      cy.location('hash').should('equal', '#/movements')
      cy.getBySel('movementListItem').contains('Test').click()
      cy.getBySel('delete').should('be.visible').click()
      cy.get('.p-confirm-dialog-accept').click()
      cy.getBySel('toast').contains('Movimento deletado com sucesso.')
      cy.location('hash').should('equal', '#/movements')
    })
  })
})
