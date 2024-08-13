import { hash } from 'bcryptjs'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('Register a pet (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a pet', async () => {
    const organization = await prisma.organization.create({
      data: {
        managerName: 'John Doe',
        email: 'john.doe@example.org',
        passwordHash: await hash('123456', 6),
        street: 'Elm Street',
        number: 1234,
        complement: 'Suite 5B',
        city: 'Springfield',
        state: 'IL',
        cellPhoneNumber: '13125556789',
        cep: '26082085',
      },
    })

    const response = await request(app.server)
      .post('/pets')
      .send({
        organizationId: organization.id,
        pet: {
          name: 'Buddy',
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
