import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryPetsRepository } from '@/repositories/pets/in-memory-pets-repository'
import { InMemoryPetsRequirement } from '@/repositories/pets-requirement-repository/in-memory-pets-requirement-repository'

import { ResourceNotFound } from '../_errors/resource-not-found'
import { GetPetUseCase } from './get-pet'

let petsRepository: InMemoryPetsRepository
let petsRequirementRepository: InMemoryPetsRequirement
let sut: GetPetUseCase

describe('Get pet', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    petsRequirementRepository = new InMemoryPetsRequirement()
    sut = new GetPetUseCase(petsRepository, petsRequirementRepository)
  })

  it('should be able to get pet by id', async () => {
    const registeredPet = await petsRepository.create({
      name: 'Buddy',
      description: 'A friendly and energetic dog looking for a loving home.',
      petAge: 'YOUNG',
      petImageUrl: 'https://example.com/images/buddy.jpg',
      petSpecies: 'Dog',
      petSize: 'MEDIUM',
      petEnergyLevel: 'HIGH',
      petSuitableEnvironment: 'BACKYARD',
      petIndependenceLevel: 'MEDIUM',
      organizationId: 'organization-01',
    })

    await petsRequirementRepository.createMany({
      petId: registeredPet.id,
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

    const { pet, requirements } = await sut.execute({
      petId: registeredPet.id,
    })

    expect(pet).toEqual(
      expect.objectContaining({
        name: pet.name,
        description: pet.description,
        petAge: pet.petAge,
        petImageUrl: pet.petImageUrl,
        petSpecies: pet.petSpecies,
        petSize: pet.petSize,
        petEnergyLevel: pet.petEnergyLevel,
        petSuitableEnvironment: pet.petSuitableEnvironment,
        petIndependenceLevel: pet.petIndependenceLevel,
        organizationId: pet.organizationId,
        createdAt: pet.createdAt,
        updatedAt: pet.updatedAt,
      }),
    )

    expect(requirements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          petId: pet.id,
        }),
      ]),
    )
  })

  it('should not be able to get pet by wrong id', async () => {
    await expect(() =>
      sut.execute({
        petId: 'non-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
