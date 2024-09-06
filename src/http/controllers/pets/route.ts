import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-role'

import { register, registerBodyJsonSchema } from './register'

export async function petsRoute(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post(
    '/pets',
    {
      schema: {
        summary: 'Register a pet',
        description:
          'Endpoint to register a new pet into the system. This endpoint allows users to provide detailed information about the pet, including its age, size, species, energy level, suitable environment, independence level, and an image URL.',
        tags: ['Pets'],
        security: [{ jwt: [] }],
        body: registerBodyJsonSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              petId: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'array', items: { type: 'string' } },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                default: 'Invalid credentials.',
              },
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
          500: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
      onRequest: [verifyUserRole('ADMIN')],
    },
    register,
  )
}
