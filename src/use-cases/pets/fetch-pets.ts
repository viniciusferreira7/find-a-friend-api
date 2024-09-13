import { Pet } from '@prisma/client'

import { PaginationResponse } from '@/interfaces/pagination'
import {
  PetAge,
  PetEnergyLevel,
  PetIndependenceLevel,
  PetSize,
} from '@/interfaces/pets'
import { OrganizationsRepository } from '@/repositories/organizations-repository'
import { PetsRepository } from '@/repositories/pets-repository'

import { ResourceNotFound } from '../errors/resource-not-found'

interface FetchPetsUseCaseRequest {
  organizationId: string
  searchParams: {
    state: string
    city: string
    age?: PetAge
    energyLevel?: PetEnergyLevel
    size?: PetSize
    species?: string
    independenceLevel?: PetIndependenceLevel
  }
}

type FetchPetsUseCaseResponse = PaginationResponse<Pet>

export class FetchPetsUseCase {
  constructor(
    private organizationsRepository: OrganizationsRepository,
    private petsRepository: PetsRepository,
  ) {}

  async execute({
    organizationId,
    searchParams,
  }: FetchPetsUseCaseRequest): Promise<FetchPetsUseCaseResponse> {
    const organization =
      await this.organizationsRepository.findById(organizationId)

    if (!organization) {
      throw new ResourceNotFound()
    }

    const paginatedResponse =
      await this.petsRepository.findManyByOrganizationId(
        organizationId,
        searchParams,
      )

    return paginatedResponse
  }
}
