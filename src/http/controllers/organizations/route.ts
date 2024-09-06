import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { authenticate, authenticateBodyJsonSchema } from './authenticate'
import { create, createBodyJsonSchema } from './create'
import { refresh } from './refresh'

export async function organizationsRoute(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post(
    '/organizations',
    {
      schema: {
        summary: 'Create an organization',
        description:
          'Tthis endpoint will return the access token to the organization to create a session.',
        tags: ['Organizations'],
        security: [{ jwt: [] }],
        body: createBodyJsonSchema,
        response: {
          201: {
            description:
              'Organization successfully created. No content returned.',
            type: 'null',
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
    create,
  )
  app.post(
    '/organizations/sessions',
    {
      schema: {
        summary: 'Create a session',
        description:
          'This endpoint allows users to create a new pet care organization within the system. Users can provide essential details about the organization, such as its name, contact information, and location. The system ensures that the organization is unique by validating the provided email address.',
        tags: ['Organizations'],
        security: [{ jwt: [] }],
        body: authenticateBodyJsonSchema,
        response: {
          201: {
            type: 'object',
            properties: {
              token: { type: 'string' },
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
          500: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    authenticate,
  )
  app.patch(
    '/organizations/refresh',
    {
      schema: {
        summary: 'Refresh token',
        description:
          'This endpoint is responsible for renewing the access token (JWT) of an authenticated user. It uses the refresh token, which was previously stored in cookies, to generate a new access token without requiring the user to resubmit their credentials.',
        tags: ['Organizations'],
        security: [{ jwt: [] }],
        response: {
          201: {
            type: 'object',
            properties: {
              token: { type: 'string' },
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
          500: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    refresh,
  )
}
