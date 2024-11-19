import { faker } from '@faker-js/faker'
import type { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'

interface GenerateOrganizations {
  location?: {
    state: string[]
    city: string[]
  }
  passwordHashed: boolean
  length?: number
  min?: number
  max?: number
}

export async function generateOrganizations({
  passwordHashed = true,
  ...params
}: GenerateOrganizations) {
  if (passwordHashed) {
    const organizations: Organization[] = await Promise.all(
      Array.from({ length: params?.length ?? 20 }).map(async () => {
        const firstName = faker.person.firstName()

        const state = params.location
          ? faker.helpers.arrayElement([
              ...params.location.state,
              faker.location.state(),
            ])
          : faker.location.state()

        const city = params.location
          ? faker.helpers.arrayElement([
              ...params.location.city,
              faker.location.city(),
            ])
          : faker.location.city()

        return {
          id: faker.string.uuid(),
          managerName: faker.person.fullName({
            firstName,
          }),
          email: faker.internet.email(),
          passwordHash: await hash(faker.internet.password({ length: 6 }), 6),
          cep: faker.number.int({ max: 8, min: 8 }).toString(),
          street: faker.location.street(),
          number: faker.number.int({ max: 7, min: 4 }),
          complement: faker.location.buildingNumber(),
          city,
          state,
          role: 'ADMIN',
          cellPhoneNumber: faker.number.int({ max: 15, min: 9 }).toString(),
          createdAt: faker.date.recent({
            days: 30,
          }),
          updatedAt: faker.date.recent({
            days: 18,
          }),
        }
      }),
    )

    return faker.helpers.arrayElements(organizations, {
      min: params?.min ?? 10,
      max: params?.max ?? 30,
    })
  }

  const organizations: Organization[] = Array.from({
    length: params?.length ?? 20,
  }).map(() => {
    const firstName = faker.person.firstName()

    return {
      id: faker.string.uuid(),
      managerName: faker.person.fullName({
        firstName,
      }),
      email: faker.internet.email(),
      passwordHash: faker.internet.password({ length: 6 }),
      cep: faker.number.int({ max: 8, min: 8 }).toString(),
      street: faker.location.street(),
      number: faker.number.int({ max: 7, min: 4 }),
      complement: faker.location.buildingNumber(),
      city: faker.location.city(),
      state: faker.location.state(),
      role: 'ADMIN',
      cellPhoneNumber: faker.number.int({ max: 15, min: 9 }).toString(),
      createdAt: faker.date.recent({
        days: 30,
      }),
      updatedAt: faker.date.recent({
        days: 18,
      }),
    }
  })

  return faker.helpers.arrayElements(organizations, {
    min: params?.min ?? 10,
    max: params?.max ?? 30,
  })
}
