import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma-organizations-repository'
import { FetchPetsUseCase } from '@/use-cases/pets/fetch-pets'

export function makeFetchPetsUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository()

  const useCase = new FetchPetsUseCase(organizationsRepository)

  return useCase
}
