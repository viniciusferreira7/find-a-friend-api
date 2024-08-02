import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory-organizations-repository'
import { InMemoryPetsRepository } from '@/repositories/pets/in-memory-pets-repository'

import { ResourceNotFound } from '../errors/resource-not-found'
import { Register } from './register'

let petsRepository: InMemoryPetsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let sut: Register

describe('Register pet', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new Register(petsRepository, organizationsRepository)
  })

  it('should be able to register a pet', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      street: 'Elm Street',
      number: 1234,
      complement: 'Suite 5B',
      city: 'Springfield',
      state: 'IL',
      cellPhoneNumber: 13125556789,
      cep: 26082085,
    })

    const { pet } = await sut.execute({
      organizationId: organization.id,
      pet: {
        name: 'Buddy',
        description: 'A friendly and energetic dog looking for a loving home.',
        age: 'YOUNG',
        petImageUrl: 'https://example.com/images/buddy.jpg',
        species: 'Dog',
        size: 'MEDIUM',
        energyLevel: 'HIGH',
        suitableEnvironment: 'BACKYARD',
        independenceLevel: 'MEDIUM',
      },
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be able to register a pet without a organization', async () => {
    await expect(() =>
      sut.execute({
        organizationId: 'no-one-organization-id',
        pet: {
          name: 'Buddy',
          description:
            'A friendly and energetic dog looking for a loving home.',
          age: 'YOUNG',
          petImageUrl: 'https://example.com/images/buddy.jpg',
          species: 'Dog',
          size: 'MEDIUM',
          energyLevel: 'HIGH',
          suitableEnvironment: 'BACKYARD',
          independenceLevel: 'MEDIUM',
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
