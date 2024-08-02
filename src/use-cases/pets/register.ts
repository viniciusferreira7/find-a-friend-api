import { Pet } from '@prisma/client'

import {
  PetAge,
  PetEnergyLevel,
  PetIndependenceLevel,
  PetSize,
  PetSuitableEnvironment,
} from '../../interfaces/pets'
import { OrganizationsRepository } from '../../repositories/organizations-repository'
import { PetsRepository } from '../../repositories/pets-repository'
import { ResourceNotFound } from '../errors/resource-not-found'

interface RegisterRequest {
  organizationId: string
  pet: {
    name: string
    description: string
    age: PetAge
    size: PetSize
    species: string
    energyLevel: PetEnergyLevel
    independenceLevel: PetIndependenceLevel
    suitableEnvironment: PetSuitableEnvironment
    petImageUrl: string
  }
}

interface RegisterResponse {
  pet: Pet
}

export class Register {
  constructor(
    private petsRepository: PetsRepository,
    private organizationsRepository: OrganizationsRepository,
  ) {}

  async execute({
    organizationId,
    pet,
  }: RegisterRequest): Promise<RegisterResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (!organization) {
      throw new ResourceNotFound()
    }

    const registeredPet = await this.petsRepository.create({
      organizationId,
      name: pet.name,
      description: pet.description,
      petAge: pet.age,
      petSize: pet.size,
      petSpecies: pet.species,
      petEnergyLevel: pet.energyLevel,
      petIndependenceLevel: pet.independenceLevel,
      petSuitableEnvironment: pet.suitableEnvironment,
      petImageUrl: pet.petImageUrl,
    })

    return { pet: registeredPet }
  }
}
