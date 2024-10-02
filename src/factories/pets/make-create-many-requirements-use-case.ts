import { PrismaOrganizationsRepository } from '@/repositories/organizations/prisma-organizations-repository'
import { PrismaPetsRepository } from '@/repositories/pets/prisma-pets-repository'
import { PrismaPetsRequirement } from '@/repositories/pets-requirement-repository/prisma-pets-requirement-repository'
import { CreateManyRequirementsUseCase } from '@/use-cases/pets/create-many-requirements'

export function makeCreateManyRequirementsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const organizationsRepository = new PrismaOrganizationsRepository()
  const petsRequirementRepository = new PrismaPetsRequirement()

  const useCase = new CreateManyRequirementsUseCase(
    organizationsRepository,
    petsRepository,
    petsRequirementRepository,
  )

  return useCase
}
