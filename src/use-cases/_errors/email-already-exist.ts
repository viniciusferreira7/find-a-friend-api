export class EmailAlreadyUsed extends Error {
  constructor() {
    super('Email already used.')
  }
}
