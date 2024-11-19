import { faker } from '@faker-js/faker'
import type { PetRequirement } from '@prisma/client'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory-organizations-repository'
import { InMemoryPetsRepository } from '@/repositories/pets/in-memory-pets-repository'
import { InMemoryPetsRequirement } from '@/repositories/pets-requirement-repository/in-memory-pets-requirement-repository'

import { ResourceNotFound } from '../_errors/resource-not-found'
import { CreateManyRequirementsUseCase } from './create-many-requirements'

let petsRepository: InMemoryPetsRepository
let organizationsRepository: InMemoryOrganizationsRepository
let petsRequirementRepository: InMemoryPetsRequirement
let sut: CreateManyRequirementsUseCase

describe('Register pet', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    petsRepository = new InMemoryPetsRepository()
    petsRequirementRepository = new InMemoryPetsRequirement()
    sut = new CreateManyRequirementsUseCase(
      organizationsRepository,
      petsRepository,
      petsRequirementRepository,
    )
  })

  it('should be able to create many requirements', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      street: 'Elm Street',
      number: 1234,
      complement: 'Suite 5B',
      city: 'Springfield',
      state: 'IL',
      cellPhoneNumber: '13125556789',
      cep: '26082085',
    })

    const pet = await petsRepository.create({
      name: 'Buddy',
      description: 'A friendly and energetic dog looking for a loving home.',
      petAge: 'YOUNG',
      petImageUrl: 'https://example.com/images/buddy.jpg',
      petSpecies: 'Dog',
      petSize: 'MEDIUM',
      petEnergyLevel: 'HIGH',
      petSuitableEnvironment: 'BACKYARD',
      petIndependenceLevel: 'MEDIUM',
      organizationId: organization.id,
    })

    const { requirements } = await sut.execute({
      organizationId: organization.id,
      petId: pet.id,
      requirements: [
        {
          name: faker.lorem.words(5),
        },
        {
          name: faker.lorem.words(5),
        },
        {
          name: faker.lorem.words(5),
        },
      ],
    })

    expect(requirements).toHaveLength(3)
    expect(requirements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          petId: pet.id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        } as PetRequirement),
      ]),
    )
  })

  it('should not be able to create many requirements without a organization', async () => {
    const pet = await petsRepository.create({
      name: 'Buddy',
      description: 'A friendly and energetic dog looking for a loving home.',
      petAge: 'YOUNG',
      petImageUrl: 'https://example.com/images/buddy.jpg',
      petSpecies: 'Dog',
      petSize: 'MEDIUM',
      petEnergyLevel: 'HIGH',
      petSuitableEnvironment: 'BACKYARD',
      petIndependenceLevel: 'MEDIUM',
      organizationId: 'no-one-organization-id',
    })

    await expect(() =>
      sut.execute({
        organizationId: 'non-id',
        petId: pet.id,
        requirements: [
          {
            name: faker.lorem.words(5),
          },
          {
            name: faker.lorem.words(5),
          },
          {
            name: faker.lorem.words(5),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to create many requirements without a pet', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
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
        organizationId: organization.id,
        petId: 'non-id',
        requirements: [
          {
            name: faker.lorem.words(5),
          },
          {
            name: faker.lorem.words(5),
          },
          {
            name: faker.lorem.words(5),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
