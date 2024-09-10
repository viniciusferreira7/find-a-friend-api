import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

import { env } from '@/env'
import { prisma } from '@/lib/prisma'

export async function createAndAuthenticateOrganization(app: FastifyInstance) {
  const organization = await prisma.organization.create({
    data: {
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      cep: '12345678',
      street: 'Elm Street',
      number: 1234,
      complement: 'Suite 5B',
      city: 'Springfield',
      state: 'IL',
      cellPhoneNumber: '12345678910',
    },
  })

  const authResponse = await request(app.server)
    .post('/organizations/sessions')
    .set('Authorization', `Bearer ${env.APP_TOKEN}`)
    .send({
      email: 'john.doe@example.org',
      password: '123456',
    })

  const { token } = authResponse.body

  return { organization, token }
}
