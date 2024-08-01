import { Pet, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import { PetsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public pets: Pet[] = []

  async create({
    organizationId,
    ...pet
  }: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const createdPet = {
      id: randomUUID(),
      organizationId,
      name: pet.name,
      description: pet.description,
      petAge: pet.petAge,
      petSize: pet.petSize,
      petSpecies: pet.petSpecies,
      petEnergyLevel: pet.petEnergyLevel,
      petIndependenceLevel: pet.petIndependenceLevel,
      petSuitableEnvironment: pet.petSuitableEnvironment,
      petImageUrl: pet.petImageUrl,
    }

    this.pets.push(createdPet)

    return createdPet
  }
}
