import type { Organization } from '@prisma/client'

import type { OrganizationsRepository } from '@/repositories/organizations-repository'

import { ResourceNotFound } from '../_errors/resource-not-found'

interface GetOrganizationUseCaseRequest {
  organizationId: string
}

interface GetOrganizationUseCaseResponse {
  organization: Organization
}

export class GetOrganizationUseCase {
  constructor(private organizationRepository: OrganizationsRepository) {}

  async execute({
    organizationId,
  }: GetOrganizationUseCaseRequest): Promise<GetOrganizationUseCaseResponse> {
    const organization =
      await this.organizationRepository.findById(organizationId)

    if (!organization) {
      throw new ResourceNotFound()
    }

    return { organization }
  }
}
