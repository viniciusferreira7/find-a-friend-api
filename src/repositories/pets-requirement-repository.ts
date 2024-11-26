import { type PetRequirement } from '@prisma/client'

interface CreateManyRequest {
  petId: string
  requirements: Array<{
    name: string
  }>
}

export interface PetsRequirementRepository {
  findByPetId(petId: string): Promise<PetRequirement[]>
  createMany({
    petId,
    requirements,
  }: CreateManyRequest): Promise<PetRequirement[]>
}
