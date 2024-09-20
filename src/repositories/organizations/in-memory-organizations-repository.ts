import { randomUUID } from 'node:crypto'

import { Organization, Pet, Prisma } from '@prisma/client'

import { PaginationRequest, PaginationResponse } from '@/interfaces/pagination'
import {
  PetAge,
  PetEnergyLevel,
  PetIndependenceLevel,
  PetSize,
} from '@/interfaces/pets'

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

export class InMemoryOrganizationsRepository
  implements OrganizationsRepository
{
  public organizations: Organization[] = []
  public pets: Pet[] = []

  async findManyPetsByCityOfOrganization(
    searchParams: SearchParams,
  ): Promise<PaginationResponse<Pet>> {
    const organizations = this.organizations.filter((item) => {
      const state =
        item.state.toLocaleLowerCase('pt-BR') ===
        searchParams.state.toLocaleLowerCase('pt-BR')
      const city =
        item.city.toLocaleLowerCase('pt-BR') ===
        searchParams.city.toLocaleLowerCase('pt-BR')

      return state && city
    })

    const petsByOrganizationId = this.pets.filter((item) => {
      return organizations.some(
        (organization) => organization.id === item.organizationId,
      )
    })

    const petsFiltered = petsByOrganizationId.filter((item) => {
      const age = searchParams.age ? item.petAge === searchParams.age : true
      const energyLevel = searchParams.energyLevel
        ? item.petEnergyLevel === searchParams.energyLevel
        : true
      const size = searchParams.size ? item.petSize === searchParams.size : true
      const species = searchParams.species
        ? item.petSpecies.toLocaleLowerCase('pt-BR') ===
          searchParams.species?.toLocaleLowerCase('pt-BR')
        : true
      const independenceLeve = searchParams.independenceLevel
        ? item.petIndependenceLevel === searchParams.independenceLevel
        : true

      return age && energyLevel && size && species && independenceLeve
    })

    const count = petsFiltered.length

    if (searchParams.paginationDisabled) {
      return {
        count,
        next: null,
        previous: null,
        page: 1,
        totalPages: 1,
        perPage: count,
        paginationDisabled: true,
        results: petsFiltered,
      }
    }

    const perPage = searchParams?.perPage ?? 10
    const currentPage = searchParams?.page ?? 1

    const totalPages = Math.ceil(petsFiltered.length / perPage)

    const nextPage = totalPages === currentPage ? null : currentPage + 1
    const previousPage = currentPage === 1 ? null : currentPage - 1

    const petsPaginated = petsFiltered.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage,
    )

    return {
      count,
      next: nextPage,
      previous: previousPage,
      page: 1,
      totalPages,
      perPage: searchParams?.perPage ?? 10,
      paginationDisabled: false,
      results: petsPaginated,
    }
  }

  async findById(id: string): Promise<Organization | null> {
    const organization = this.organizations.find((item) => item.id === id)

    if (!organization) {
      return null
    }

    return organization
  }

  async findByEmail(email: string): Promise<Organization | null> {
    const organization = this.organizations.find((item) => item.email === email)

    if (!organization) {
      return null
    }

    return organization
  }

  async create(
    data: Prisma.OrganizationUncheckedCreateInput,
  ): Promise<Organization> {
    const organization: Organization = {
      id: data.id ?? randomUUID(),
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
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'ADMIN',
    }

    this.organizations.push(organization)

    return organization
  }
}
