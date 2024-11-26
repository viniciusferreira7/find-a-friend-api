import type { Pet, PetRequirement } from '@prisma/client'

import type { PetsRepository } from '@/repositories/pets-repository'
import type { PetsRequirementRepository } from '@/repositories/pets-requirement-repository'

import { ResourceNotFound } from '../_errors/resource-not-found'

interface GetPetUseCaseRequest {
  petId: string
}

interface GetPetUseCaseResponse {
  pet: Pet
  requirements: PetRequirement[]
}

export class GetPetUseCase {
  constructor(
    private petRepository: PetsRepository,
    private petsRequirementRepository: PetsRequirementRepository,
  ) {}

  async execute({
    petId,
  }: GetPetUseCaseRequest): Promise<GetPetUseCaseResponse> {
    const pet = await this.petRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFound()
    }

    const petRequirements =
      await this.petsRequirementRepository.findByPetId(petId)

    return { pet, requirements: petRequirements }
  }
}
