import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { env } from '@/env'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
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

    const authResponse = await request(app.server)
      .post('/organizations/sessions')
      .set('Authorization', `Bearer ${env.APP_TOKEN}`)
      .send({
        email,
        password,
      })

    const getCookies = authResponse.get('Set-Cookie')

    const cookies = Array.isArray(getCookies) ? getCookies : []

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)

    expect(response.statusCode).toEqual(200)

    expect(response.body.token).toEqual(expect.any(String))

    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
