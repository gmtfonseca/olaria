/// <reference types="Cypress" />
/// <reference types="../support" />

describe('Inventory', () => {
  beforeEach(() => {
    cy.seedDb()
    cy.signin()
  })

  describe('InventoryList', () => {
    it('should display ponds and search by pond name', () => {
      cy.visit('/#/inventories')
      cy.getBySel('inventoryListItem')
        .should('have.length', 3)
        .and('contain', '01 (800)')
        .and('contain', '50 UN')

      cy.getBySel('searchToggle').click()
      cy.getBySel('searchInput').type('800')
      cy.getBySel('inventoryListItem').should('have.length', 1)
    })

    it('should switch view mode to fish and search by fish name', () => {
      cy.visit('/#/inventories')
      cy.getBySel('viewMode').find('.p-button').contains('Peixe').click()
      cy.getBySel('inventoryListItem')
        .should('have.length', 3)
        .and('contain', 'CASCUDO P')
        .and('contain', '50 UN')

      cy.getBySel('searchToggle').click()
      cy.getBySel('searchInput').type('CAUDA P')
      cy.getBySel('inventoryListItem').should('have.length', 2)
    })
  })

  describe('InventoryList x InventorySummary', () => {
    it('should open inventory summary by pond when clicking on pond', () => {
      cy.visit('/#/inventories')
      cy.getBySel('inventoryListItem').contains('01 (800)').click()
      cy.location('hash').should('contains', '#/inventories/summary?viewMode=P')
      cy.getBySel('headerName').contains('01 (800)')
      cy.getBySel('headerQuantity').contains('50 UN')
      cy.getBySel('inventorySummaryItem').should('have.length', 1)
      cy.getBySel('drainPond').should('be.visible')
    })

    it('should drain pond', () => {
      cy.visit('/#/inventories')
      cy.getBySel('inventoryListItem').contains('01 (800)').click()
      cy.location('hash').should('contains', '#/inventories/summary?viewMode=P')
      cy.getBySel('drainPond').should('be.visible').click()
      cy.get('.p-confirm-dialog-accept').click()
      cy.getBySel('headerQuantity').contains('0 UN')
    })

    it('should open inventory summary by fish when clicking on fish', () => {
      cy.visit('/#/inventories')
      cy.getBySel('viewMode').find('.p-button').contains('Peixe').click()
      cy.getBySel('inventoryListItem').contains('CASCUDO P').click()
      cy.location('hash').should('contains', '#/inventories/summary?viewMode=F')
      cy.getBySel('headerName').contains('CASCUDO P')
      cy.getBySel('headerQuantity').contains('50 UN')
      cy.getBySel('inventorySummaryItem').should('have.length', 1)
      cy.getBySel('drainPond').should('not.exist')
    })

    describe('InventorySummaryDialog', () => {
      it('should open movement list when clicking on history', () => {
        cy.visit('/#/inventories')
        cy.getBySel('inventoryListItem').contains('01 (800)').click()
        cy.getBySel('inventorySummaryItem').first().click()
        cy.getBySel('inventorySummaryDialog').should('be.visible')
        cy.getBySel('history').click()
        cy.location('hash').should('contains', '#/movements')
      })

      it('should open transfer form when clicking on transfer', () => {
        cy.visit('/#/inventories')
        cy.getBySel('inventoryListItem').contains('01 (800)').click()
        cy.getBySel('inventorySummaryItem').first().click()
        cy.getBySel('inventorySummaryDialog').should('be.visible')
        cy.getBySel('transfer').click()
        cy.location('hash').should('contains', '#/transfer')
      })

      it('should open movement form when clicking on in', () => {
        cy.visit('/#/inventories')
        cy.getBySel('inventoryListItem').contains('01 (800)').click()
        cy.getBySel('inventorySummaryItem').first().click()
        cy.getBySel('inventorySummaryDialog').should('be.visible')
        cy.getBySel('in').click()
        cy.location('hash').should('contains', '#/movements/create')
      })

      it('should open movement form when clicking on out', () => {
        cy.visit('/#/inventories')
        cy.getBySel('inventoryListItem').contains('01 (800)').click()
        cy.getBySel('inventorySummaryItem').first().click()
        cy.getBySel('inventorySummaryDialog').should('be.visible')
        cy.getBySel('out').click()
        cy.location('hash').should('contains', '#/movements/create')
      })
    })
  })
})
