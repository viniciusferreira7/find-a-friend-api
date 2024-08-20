import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma-organizations-repository'
import { PrismaPetsRepository } from '@/repositories/pets/prisma-pets-repository'
import { RegisterUseCase } from '@/use-cases/pets/register'

export function makeRegisterUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const organizationsRepository = new PrismaOrganizationsRepository()

  const useCase = new RegisterUseCase(petsRepository, organizationsRepository)

  return useCase
}
