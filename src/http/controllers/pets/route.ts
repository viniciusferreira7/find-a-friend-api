import { FastifyInstance } from 'fastify'

import { register } from './register'

export async function petsRoute(app: FastifyInstance) {
  app.post('/pets', register)
}
