import { faker } from '@faker-js/faker'
import type { Pet } from '@prisma/client'

import type {
  PetAge,
  PetEnergyLevel,
  PetIndependenceLevel,
  PetSize,
  PetSuitableEnvironment,
} from '@/interfaces/pets'

interface GeneratePets {
  organizationIds: Array<string>
}

export function generatePets({ organizationIds }: GeneratePets) {
  const pets: Pet[] = Array.from({ length: 500 }).map(() => {
    const petAge: PetAge = faker.helpers.arrayElement([
      'NEWBORN',
      'INFANT',
      'JUVENILE',
      'ADOLESCENT',
      'YOUNG',
      'ADULT',
      'MATURE',
      'SENIOR',
      'ELDERLY',
      'GERIATRIC',
    ])

    const petSize: PetSize = faker.helpers.arrayElement([
      'SMALL',
      'MEDIUM',
      'LARGE',
      'EXTRA_LARGE',
    ])

    const petEnergyLevel: PetEnergyLevel = faker.helpers.arrayElement([
      'LOW',
      'MODERATE',
      'HIGH',
      'VERY_HIGH',
    ])

    const petSuitableEnvironment: PetSuitableEnvironment =
      faker.helpers.arrayElement([
        'AMPLE_SPACE',
        'SMALL_APARTMENT',
        'BACKYARD',
        'INDOOR',
        'OUTDOOR',
        'RURAL_ENVIRONMENT',
        'URBAN_ENVIRONMENT',
      ])

    const petIndependenceLevel: PetIndependenceLevel =
      faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH'])
    const organizationId = faker.helpers.arrayElement([...organizationIds])

    const petSpecies = faker.helpers.arrayElement([
      'Border collie',
      faker.animal.dog(),
      faker.animal.cat(),
    ])

    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      description: faker.lorem.words({ min: 45, max: 110 }).slice(0, 300),
      petImageUrl: faker.image.urlLoremFlickr({ category: 'animals' }),
      petSpecies,
      petSize,
      petEnergyLevel,
      petAge,
      petSuitableEnvironment,
      petIndependenceLevel,
      organizationId,
      createdAt: faker.date.recent({
        days: 28,
      }),
      updatedAt: faker.date.recent({
        days: 18,
      }),
    }
  })

  return pets
}
