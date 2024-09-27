import { faker } from '@faker-js/faker'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { generatePets } from '@/utils/generate-pets'
import { generateOrganizations } from '@/utils/test/generate-organizations'

describe('Fetch pets (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch a pets', async () => {
    const state = faker.location.state()
    const city = faker.location.city()

    const organizations = await generateOrganizations({
      passwordHashed: true,
      location: {
        state: [state],
        city: [city],
      },
      length: 10,
    })

    const organizationsIdsCreated =
      await prisma.organization.createManyAndReturn({
        select: {
          id: true,
        },
        data: organizations.map((organization) => {
          return {
            managerName: organization.managerName,
            email: organization.email,
            passwordHash: organization.passwordHash,
            cep: organization.cep,
            street: organization.street,
            number: organization.number,
            complement: organization.complement,
            city: organization.city,
            state: organization.state,
            cellPhoneNumber: organization.cellPhoneNumber,
          }
        }),
      })

    const pets = generatePets({
      organizationIds: organizationsIdsCreated.map((item) => item.id),
      length: 100,
    })

    await prisma.pet.createMany({
      data: pets.map((pet) => {
        return {
          organizationId: pet.organizationId,
          name: '',
          description: pet.description,
          petAge: pet.petAge,
          petSize: pet.petSize,
          petSpecies: pet.petSpecies,
          petEnergyLevel: pet.petEnergyLevel,
          petIndependenceLevel: pet.petIndependenceLevel,
          petSuitableEnvironment: pet.petSuitableEnvironment,
          petImageUrl: pet.petImageUrl,
        }
      }),
    })

    const response = await request(app.server)
      .get(`/pets?state=${state}&city=${city}`)
      .set('Authorization', `Bearer ${env.APP_TOKEN}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        count: expect.any(Number),
        next: expect.any(Number),
        previous: null,
        page: 1,
        totalPages: expect.any(Number),
        perPage: 10,
        paginationDisabled: false,
        results: expect.any(Array),
      }),
    )
  })
})
