import { Pet, Prisma } from '@prisma/client'

import { prisma } from '../../lib/prisma'
import { PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async create({
    organizationId,
    ...pet
  }: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const createdPet = await prisma.pet.create({
      data: {
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
      },
    })

    return createdPet
  }
}
