import type { PetRequirement } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type { PetsRequirementRepository } from '../pets-requirement-repository'

interface CreateManyRequest {
  petId: string
  requirement: Array<{
    name: string
  }>
}

export class PrismaPetsRequirement implements PetsRequirementRepository {
  async createMany({
    petId,
    requirement,
  }: CreateManyRequest): Promise<PetRequirement[]> {
    const requirements = requirement.map((requirement) => {
      return {
        name: requirement.name,
        petId,
      }
    })

    const petRequirements = await prisma.petRequirement.createManyAndReturn({
      data: requirements,
    })

    return petRequirements
  }
}
