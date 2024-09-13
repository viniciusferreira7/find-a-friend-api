import { Pet, Prisma } from '@prisma/client'

import { PaginationResponse } from '@/interfaces/pagination'
import {
  PetAge,
  PetEnergyLevel,
  PetIndependenceLevel,
  PetSize,
} from '@/interfaces/pets'

interface SearchParams {
  state: string
  city: string
  age?: PetAge
  energyLevel?: PetEnergyLevel
  size?: PetSize
  species?: string
  independenceLevel?: PetIndependenceLevel
}

export interface PetsRepository {
  findManyByOrganizationId(
    organizationId: string,
    searchParams: SearchParams,
  ): Promise<PaginationResponse<Pet>>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
