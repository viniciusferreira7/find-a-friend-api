import { type PetRequirement } from '@prisma/client'

interface CreateRequest {
  organizationId: string
  requirement: string[]
}

export interface PetsRequirementRepository {
  createMany({
    organizationId,
    requirement,
  }: CreateRequest): Promise<PetRequirement[]>
}
