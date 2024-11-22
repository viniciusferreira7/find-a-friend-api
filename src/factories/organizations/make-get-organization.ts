import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma-organizations-repository'
import { GetOrganizationUseCase } from '@/use-cases/organizations/get-organization'

export function makeGetOrganization() {
  const organizationsRepository = new PrismaOrganizationsRepository()

  const useCase = new GetOrganizationUseCase(organizationsRepository)

  return useCase
}
