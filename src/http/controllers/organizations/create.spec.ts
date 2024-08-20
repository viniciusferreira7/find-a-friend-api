import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Create an organization (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an organization', async () => {
    const response = await request(app.server).post('/organizations').send({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      password: '123456',
      cep: '12345678',
      street: 'Elm Street',
      number: 1234,
      complement: 'Suite 5B',
      city: 'Springfield',
      state: 'IL',
      cellPhoneNumber: '12345678910',
    })

    expect(response.status).toBe(201)
  })
})
