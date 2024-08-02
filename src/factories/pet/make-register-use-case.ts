import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma-organizations-repository'
import { PrismaPetsRepository } from '@/repositories/pets/prisma-pets-repository'
import { Register } from '@/use-cases/pets/register'

export function makeRegisterUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const organizationsRepository = new PrismaOrganizationsRepository()

  const useCase = new Register(petsRepository, organizationsRepository)

  return useCase
}
