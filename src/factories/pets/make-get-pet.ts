import { PrismaPetsRepository } from '@/repositories/pets/prisma-pets-repository'
import { PrismaPetsRequirement } from '@/repositories/pets-requirement-repository/prisma-pets-requirement-repository'
import { GetPetUseCase } from '@/use-cases/pets/get-pet'

export function makeGetPetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const petsRequirementRepository = new PrismaPetsRequirement()

  const useCase = new GetPetUseCase(petsRepository, petsRequirementRepository)

  return useCase
}
