import type { PetRequirement } from '@prisma/client'

import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { PetsRepository } from '@/repositories/pets-repository'
import type { PetsRequirementRepository } from '@/repositories/pets-requirement-repository'

import { ResourceNotFound } from '../_errors/resource-not-found'

interface CreateManyRequirementsUseCaseRequest {
  organizationId: string
  petId: string
  requirement: Array<{
    name: string
  }>
}

interface CreateManyRequirementsUseCaseResponse {
  requirements: PetRequirement[]
}

export class CreateManyRequirementsUseCase {
  constructor(
    private organizationsRepository: OrganizationsRepository,
    private petsRepository: PetsRepository,
    private petsRequirementRepository: PetsRequirementRepository,
  ) {}

  async execute({
    organizationId,
    petId,
    requirement,
  }: CreateManyRequirementsUseCaseRequest): Promise<CreateManyRequirementsUseCaseResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (!organization) {
      throw new ResourceNotFound()
    }

    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFound()
    }

    const requirements = await this.petsRequirementRepository.createMany({
      petId,
      requirement,
    })

    return { requirements }
  }
}
