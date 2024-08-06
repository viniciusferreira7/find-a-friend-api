import fastifyScalar from '@scalar/fastify-api-reference'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { petsRoute } from './http/controllers/pets/route'
import { swagger } from './lib/swagger'

export const app = fastify()

swagger(app)

app.register(fastifyScalar, {
  routePrefix: '/reference',
})

app.register(petsRoute)

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
