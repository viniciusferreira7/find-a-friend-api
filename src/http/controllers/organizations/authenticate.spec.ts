import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { env } from '@/env'

describe('Authenticate (E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const email = 'john.doe@example.org'
    const password = '123456'

    await request(app.server)
      .post('/organizations')
      .set('Authorization', `Bearer ${env.APP_TOKEN}`)
      .send({
        managerName: 'John Doe',
        email,
        password,
        cep: '12345678',
        street: 'Elm Street',
        number: 1234,
        complement: 'Suite 5B',
        city: 'Springfield',
        state: 'IL',
        cellPhoneNumber: '12345678910',
      })

    const response = await request(app.server)
      .post('/organizations/sessions')
      .set('Authorization', `Bearer ${env.APP_TOKEN}`)
      .send({
        email,
        password,
      })

    expect(response.status).toBe(200)
    expect(response.body.token).toEqual(expect.any(String))
  })
})
