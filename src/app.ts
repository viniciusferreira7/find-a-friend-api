import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifyScalar from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { organizationsRoute } from './http/controllers/organizations/route'
import { petsRoute } from './http/controllers/pets/route'
import { swagger } from './lib/swagger'

export const app = fastify()

swagger(app)

app.register(fastifyScalar, {
  routePrefix: '/reference',
})

app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(petsRoute)
app.register(organizationsRoute)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
