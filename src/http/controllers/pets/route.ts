import { FastifyInstance } from 'fastify'

import { register, registerBodyJsonSchema } from './register'

export async function petsRoute(app: FastifyInstance) {
  app.post(
    '/pets',
    {
      schema: {
        summary: 'Register a pet',
        description:
          'Endpoint to register a new pet into the system. This endpoint allows users to provide detailed information about the pet, including its age, size, species, energy level, suitable environment, independence level, and an image URL.',
        tags: ['Pets'],
        body: registerBodyJsonSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              petId: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'Resource not found',
                default: 'Resource not found',
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'array', items: { type: 'string' } },
            },
          },
          500: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    register,
  )
}
