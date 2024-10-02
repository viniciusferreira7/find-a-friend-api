import { type PetRequirement } from '@prisma/client'

interface CreateManyRequest {
  petId: string
  requirement: Array<{
    name: string
  }>
}

export interface PetsRequirementRepository {
  createMany({
    petId,
    requirement,
  }: CreateManyRequest): Promise<PetRequirement[]>
}
