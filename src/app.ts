import fastify from 'fastify'

import { petsRoute } from './http/controllers/pets/route'

export const app = fastify()

app.register(petsRoute)
