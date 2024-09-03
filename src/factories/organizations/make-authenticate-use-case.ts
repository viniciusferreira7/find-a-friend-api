import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma-organizations-repository'
import { AuthenticateUseCase } from '@/use-cases/organizations/authenticate'

export function makeAuthenticateUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository()

  const useCase = new AuthenticateUseCase(organizationsRepository)

  return useCase
}
