import type { PetRequirement } from '@prisma/client'
import { randomUUID } from 'crypto'

import type { PetsRequirementRepository } from '../pets-requirement-repository'

interface CreateManyRequest {
  petId: string
  requirement: Array<{
    name: string
  }>
}

export class InMemoryPetsRequirement implements PetsRequirementRepository {
  public petRequirements: PetRequirement[] = []

  async createMany({
    petId,
    requirement,
  }: CreateManyRequest): Promise<PetRequirement[]> {
    const requirements = requirement.map((requirement) => {
      return {
        id: randomUUID(),
        name: requirement.name,
        petId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    this.petRequirements.push(...requirements)

    return this.petRequirements
  }
}
