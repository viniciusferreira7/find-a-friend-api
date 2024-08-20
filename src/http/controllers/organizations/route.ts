import { FastifyInstance } from 'fastify'

import { create, createBodyJsonSchema } from './create'

export async function organizationsRoute(app: FastifyInstance) {
  app.post(
    '/organizations',
    {
      schema: {
        summary: 'Create an organization',
        description:
          'This endpoint allows users to create a new pet care organization within the system. Users can provide essential details about the organization, such as its name, contact information, and location. The system ensures that the organization is unique by validating the provided email address.',
        tags: ['Organizations'],
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
}
