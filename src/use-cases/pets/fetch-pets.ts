import { Pet } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/interfaces/pagination'
import {
  PetAge,
  PetEnergyLevel,
  PetIndependenceLevel,
  PetSize,
} from '@/interfaces/pets'
import { OrganizationsRepository } from '@/repositories/organizations-repository'

interface FetchPetsUseCaseRequest extends PaginationRequest {
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
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    searchParams,
  }: FetchPetsUseCaseRequest): Promise<FetchPetsUseCaseResponse> {
    const paginatedResponse =
      await this.organizationsRepository.findManyOrganizations(searchParams)

    return paginatedResponse
  }
}
