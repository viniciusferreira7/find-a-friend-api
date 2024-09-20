import { Organization, Pet, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/interfaces/pagination'
import {
  PetAge,
  PetEnergyLevel,
  PetIndependenceLevel,
  PetSize,
} from '@/interfaces/pets'

interface SearchParams extends PaginationRequest {
  state: string
  city: string
  age?: PetAge
  energyLevel?: PetEnergyLevel
  size?: PetSize
  species?: string
  independenceLevel?: PetIndependenceLevel
}

export interface OrganizationsRepository {
  findManyPetsByCityOfOrganization(
    searchParams: SearchParams,
  ): Promise<PaginationResponse<Pet>>
  findById(id: string): Promise<Organization | null>
  findByEmail(email: string): Promise<Organization | null>
  create(data: Prisma.OrganizationUncheckedCreateInput): Promise<Organization>
}
