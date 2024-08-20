import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma-organizations-repository'
import { CreateUseCase } from '@/use-cases/organizations/create'

export function makeCreateUseCase() {
  const organizationsRepository = new PrismaOrganizationsRepository()

  const useCase = new CreateUseCase(organizationsRepository)

  return useCase
}
