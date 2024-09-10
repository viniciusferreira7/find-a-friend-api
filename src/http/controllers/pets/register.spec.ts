import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'

describe('Register a pet (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a pet', async () => {
    const { organization, token } = await createAndAuthenticateOrganization(app)

    const response = await request(app.server)
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

    expect(response.statusCode).toEqual(201)
    expect(response.body.petId).toEqual(expect.any(String))
  })
})
