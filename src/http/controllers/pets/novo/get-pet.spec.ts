import { faker } from '@faker-js/faker'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { env } from '@/env'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'

describe('Get pet', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get pet by id', async () => {
    const { organization, token } = await createAndAuthenticateOrganization(app)

    const registeredPet = await request(app.server)
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

    const petId = registeredPet.body.petId

    const requirementName = faker.lorem.words(10)

    await request(app.server)
      .post(`/pets/${petId}/requirement`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        requirements: [
          {
            name: requirementName,
          },
        ],
      })

    const response = await request(app.server)
      .get(`/pets/${petId}`)
      .set('Authorization', `Bearer ${env.APP_TOKEN}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        pet: expect.objectContaining({
          id: petId,
          name: 'Buddy 1',
          description:
            'A friendly and energetic dog looking for a loving home.',
          petAge: 'YOUNG',
          petImageUrl: 'https://example.com/images/buddy.jpg',
          petSpecies: 'dog',
          petSize: 'MEDIUM',
          petEnergyLevel: 'HIGH',
          petSuitableEnvironment: 'BACKYARD',
          petIndependenceLevel: 'MEDIUM',
          organizationId: organization.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
        requirements: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: requirementName,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            petId,
          }),
        ]),
      }),
    )
  })
})
