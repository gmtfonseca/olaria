declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    getBySel(selector: string, ...args: unknown): Chainable<unknown>
    seedDb(): void
    signin(): void
  }
}
