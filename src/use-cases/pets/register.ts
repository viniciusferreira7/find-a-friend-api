import { Pet } from '@prisma/client'

import {
  PetAge,
  PetEnergyLevel,
  PetIndependenceLevel,
  PetSize,
  PetSuitableEnvironment,
} from '../../interfaces/pets'

interface RegisterRequest {
  name: string
  description: string
  age: PetAge
  size: PetSize
  energyLevel: PetEnergyLevel
  independenceLevel: PetIndependenceLevel
  suitableEnvironment: PetSuitableEnvironment
  petImageUrl: string
}

interface RegisterResponse {
  pet: Pet
}

export class Register {
  async execute({
    name,
    description,
    age,
    size,
    energyLevel,
    independenceLevel,
    suitableEnvironment,
    petImageUrl,
  }: RegisterRequest): Promise<RegisterResponse> {
    console.log({
      name,
      description,
      age,
      size,
      energyLevel,
      independenceLevel,
      suitableEnvironment,
      petImageUrl,
    })
  }
}
