import type { PetRequirement } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type { PetsRequirementRepository } from '../pets-requirement-repository'

interface CreateManyRequest {
  petId: string
  requirements: Array<{
    name: string
  }>
}

export class PrismaPetsRequirement implements PetsRequirementRepository {
  async createMany({
    petId,
    requirements,
  }: CreateManyRequest): Promise<PetRequirement[]> {
    const createdRequirements = requirements.map((requirement) => {
      return {
        name: requirement.name,
        petId,
      }
    })

    const petRequirements = await prisma.petRequirement.createManyAndReturn({
      data: createdRequirements,
    })

    return petRequirements
  }
}