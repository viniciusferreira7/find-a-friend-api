import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory-organizations-repository'

import { InvalidCredentialsError } from '../_errors/invalid-credentials-error'
import { AuthenticateUseCase } from './authenticate'

let organizationsRepository: InMemoryOrganizationsRepository
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new AuthenticateUseCase(organizationsRepository)
  })

  it('should be able to authenticate', async () => {
    const email = 'john.doe@example.org'
    const password = '123456'

    await organizationsRepository.create({
      managerName: 'John Doe',
      email,
      passwordHash: await hash(password, 6),
      street: 'Elm Street',
      number: 1234,
      complement: 'Suite 5B',
      city: 'Springfield',
      state: 'IL',
      cellPhoneNumber: '13125556789',
      cep: '26082085',
    })

    const { organization } = await sut.execute({
      email,
      password,
    })

    expect(organization.email).to.equal(email)
  })

  it('should not be able to authenticate with a wrong email', async () => {
    const email = 'john.doe@example.org'
    const password = '123456'

    await organizationsRepository.create({
      managerName: 'John Doe',
      email,
      passwordHash: await hash(password, 6),
      street: 'Elm Street',
      number: 1234,
      complement: 'Suite 5B',
      city: 'Springfield',
      state: 'IL',
      cellPhoneNumber: '13125556789',
      cep: '26082085',
    })

    await expect(() =>
      sut.execute({
        email: 'wrong.email@example.com',
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with a wrong password', async () => {
    const email = 'john.doe@example.org'
    const password = '123456'

    await organizationsRepository.create({
      managerName: 'John Doe',
      email,
      passwordHash: await hash(password, 6),
      street: 'Elm Street',
      number: 1234,
      complement: 'Suite 5B',
      city: 'Springfield',
      state: 'IL',
      cellPhoneNumber: '13125556789',
      cep: '26082085',
    })

    await expect(() =>
      sut.execute({
        email,
        password: 'wrong_password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
