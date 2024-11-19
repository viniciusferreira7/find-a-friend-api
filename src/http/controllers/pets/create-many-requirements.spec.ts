import { faker } from '@faker-js/faker'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'

describe('Create many requirements (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create requirements to adopt a pet', async () => {
    const { organization, token } = await createAndAuthenticateOrganization(app)

    const createdPetResponse = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        organizationId: organization.id,
        pet: {
          name: 'Buddy 1',
          description:
            'A friendly and energetic dog looking for a loving home.',
          age: 'YOUNG',
          petImageUrl: 'https://example.com/images/buddy.jpg',
          species: 'Dog',
          size: 'MEDIUM',
          energyLevel: 'HIGH',
          suitableEnvironment: 'BACKYARD',
          independenceLevel: 'MEDIUM',
        },
      })

    const petId = createdPetResponse.body.petId

    const requirementName = faker.lorem.words(10)

    const response = await request(app.server)
      .post(`/pets/${petId}/requirement`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        requirements: [
          {
            name: requirementName,
          },
        ],
      })

    const petRequirement = await prisma.petRequirement.findMany({
      where: {
        petId,
        name: {
          equals: requirementName,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    expect(response.statusCode).toEqual(201)
    expect(petRequirement[0].name).toEqual(requirementName)
  })
})
