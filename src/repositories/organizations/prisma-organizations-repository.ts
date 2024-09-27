import { Organization, type Pet, Prisma } from '@prisma/client'

import type {
  PaginationRequest,
  PaginationResponse,
} from '@/interfaces/pagination'
import type {
  PetAge,
  PetEnergyLevel,
  PetIndependenceLevel,
  PetSize,
} from '@/interfaces/pets'
import { prisma } from '@/lib/prisma'

import { OrganizationsRepository } from '../organizations-repository'

interface SearchParams extends PaginationRequest {
  state: string
  city: string
  age?: PetAge
  energyLevel?: PetEnergyLevel
  size?: PetSize
  species?: string
  independenceLevel?: PetIndependenceLevel
}

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  async findManyPetsByCityOfOrganization(
    searchParams: SearchParams,
  ): Promise<PaginationResponse<Pet>> {
    const organizationsId = await prisma.organization.findMany({
      where: {
        city: searchParams.city,
        state: searchParams.state,
      },
      select: {
        id: true,
      },
    })

    if (searchParams.paginationDisabled) {
      const pets = await prisma.pet.findMany({
        where: {
          organizationId: {
            in: organizationsId.map((item) => item.id),
          },
          petAge: searchParams.age,
          petEnergyLevel: searchParams.energyLevel,
          petSize: searchParams.size,
          petSpecies: {
            contains: searchParams.species,
          },
          petIndependenceLevel: searchParams.independenceLevel,
        },
      })

      return {
        count: pets.length,
        next: null,
        previous: null,
        page: 1,
        totalPages: 1,
        perPage: pets.length,
        paginationDisabled: true,
        results: pets,
      }
    }

    const perPage = searchParams?.perPage ?? 10
    const currentPage = searchParams?.page ?? 1

    const count = await prisma.pet.count({
      where: {
        organizationId: {
          in: organizationsId.map((item) => item.id),
        },
        petAge: searchParams.age,
        petEnergyLevel: searchParams.energyLevel,
        petSize: searchParams.size,
        petSpecies: {
          contains: searchParams.species,
        },
        petIndependenceLevel: searchParams.independenceLevel,
      },
    })

    const totalPages = Math.ceil(count / perPage)

    const petsWithPagination = await prisma.pet.findMany({
      where: {
        organizationId: {
          in: organizationsId.map((item) => item.id),
        },
        petAge: searchParams.age,
        petEnergyLevel: searchParams.energyLevel,
        petSize: searchParams.size,
        petSpecies: {
          contains: searchParams.species,
        },
        petIndependenceLevel: searchParams.independenceLevel,
      },
      take: perPage,
      skip: (currentPage - 1) * perPage,
    })

    const nextPage = totalPages === currentPage ? null : currentPage + 1
    const previousPage = currentPage === 1 ? null : currentPage - 1

    return {
      count,
      next: count <= 0 ? null : nextPage,
      previous: previousPage,
      page: currentPage,
      perPage,
      totalPages,
      paginationDisabled: !!searchParams.paginationDisabled,
      results: petsWithPagination,
    }
  }

  async findById(id: string): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({
      where: {
        id,
      },
    })

    return organization
  }

  async findByEmail(email: string): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({
      where: {
        email,
      },
    })

    return organization
  }

  async create(
    data: Prisma.OrganizationUncheckedCreateInput,
  ): Promise<Organization> {
    const organization = await prisma.organization.create({
      data: {
        managerName: data.managerName,
        email: data.email,
        passwordHash: data.passwordHash,
        street: data.street,
        number: data.number,
        complement: data.complement,
        city: data.city,
        state: data.state,
        cellPhoneNumber: data.cellPhoneNumber,
        cep: data.cep,
        role: 'ADMIN',
      },
    })

    return organization
  }
}
