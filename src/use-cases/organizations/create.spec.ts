import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory-organizations-repository'

import { EmailAlreadyUsed } from '../_errors/email-already-exist'
import { CreateUseCase } from './create'

let organizationsRepository: InMemoryOrganizationsRepository
let sut: CreateUseCase

describe('Create an organization', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new CreateUseCase(organizationsRepository)
  })

  it('should be able to create an organization', async () => {
    const { organization } = await sut.execute({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      password: '123456',
      street: 'Elm Street',
      number: 1234,
      complement: 'Suite 5B',
      city: 'Springfield',
      state: 'IL',
      cellPhoneNumber: '13125556789',
      cep: '26082085',
    })

    expect(organization.id).toEqual(expect.any(String))
  })

  it('should be able hash password upon create', async () => {
    const { organization } = await sut.execute({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      password: '123456',
      street: 'Elm Street',
      number: 1234,
      complement: 'Suite 5B',
      city: 'Springfield',
      state: 'IL',
      cellPhoneNumber: '13125556789',
      cep: '26082085',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      organization.passwordHash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to create a new organization with an email already used', async () => {
    const email = 'john.doe@example.org'

    await sut.execute({
      managerName: 'John Doe',
      email,
      password: '123456',
      street: 'Elm Street',
      number: 1234,
      complement: 'Suite 5B',
      city: 'Springfield',
      state: 'IL',
      cellPhoneNumber: '13125556789',
      cep: '26082085',
    })

    await expect(
      sut.execute({
        managerName: 'John Doe',
        email: 'john.doe@example.org',
        password: '123456',
        street: 'Elm Street',
        number: 1234,
        complement: 'Suite 5B',
        city: 'Springfield',
        state: 'IL',
        cellPhoneNumber: '13125556789',
        cep: '26082085',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyUsed)
  })
})
