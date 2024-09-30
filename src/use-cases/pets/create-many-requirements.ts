import type { PetRequirement } from '@prisma/client'

import type { OrganizationsRepository } from '@/repositories/organizations-repository'
import type { PetsRequirementRepository } from '@/repositories/pets-requirement-repository'

import { ResourceNotFound } from '../_errors/resource-not-found'

interface CreateManyRequirementsUseCaseRequest {
  organizationId: string
  requirement: string[]
}

interface CreateManyRequirementsUseCaseResponse {
  requirements: PetRequirement[]
}

export class CreateManyRequirementsUseCase {
  constructor(
    private organizationsRepository: OrganizationsRepository,
    private petsRequirementRepository: PetsRequirementRepository,
  ) {}

  async execute({
    organizationId,
    requirement,
  }: CreateManyRequirementsUseCaseRequest): Promise<CreateManyRequirementsUseCaseResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (organization) {
      throw new ResourceNotFound()
    }

    const requirements = await this.petsRequirementRepository.createMany({
      organizationId,
      requirement,
    })

    return { requirements }
  }
}
