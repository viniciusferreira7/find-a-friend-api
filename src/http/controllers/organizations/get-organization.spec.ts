import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { env } from '@/env'
import { createAndAuthenticateOrganization } from '@/utils/test/create-and-authenticate-organization'

describe('Get an organization (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get an organization', async () => {
    const { organization } = await createAndAuthenticateOrganization(app)

    const response = await request(app.server)
      .get(`/organizations/${organization.id}`)
      .set('Authorization', `Bearer ${env.APP_TOKEN}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        organization: expect.objectContaining({
          id: organization.id,
          managerName: organization.managerName,
          email: organization.email,
          cep: organization.cep,
          street: organization.street,
          number: organization.number,
          complement: organization.complement,
          city: organization.city,
          state: organization.state,
          role: organization.role,
          cellPhoneNumber: organization.cellPhoneNumber,
          createdAt: organization.createdAt.toISOString(),
          updatedAt: organization.updatedAt.toISOString(),
        }),
      }),
    )
  })
})
