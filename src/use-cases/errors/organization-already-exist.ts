export class OrganizationAlreadyExists extends Error {
  constructor() {
    super('Organization already exists.')
  }
}
