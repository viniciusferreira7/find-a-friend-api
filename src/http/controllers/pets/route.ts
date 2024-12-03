import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-role'

import {
  createManyRequirements,
  createManyRequirementsBodySchemaToJson,
  createManyRequirementsParamsSchemaToJson,
} from './create-many-requirements'
import { fetchPets, fetchPetsSearchParamsSchemaToJson } from './fetch-pets'
import { getPet, GetPetParamsSchemaToJson } from './get-pet'
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

  app.post(
    '/pets/:petId/requirement',
    {
      schema: {
        summary: 'Create many requirements',
        description: 'Endpoint to create requirements to adopt a pet',
        tags: ['Pets', 'Pet-Requirements'],
        security: [{ jwt: [] }],
        params: createManyRequirementsParamsSchemaToJson,
        body: createManyRequirementsBodySchemaToJson,
        response: {
          201: {
            description:
              'Requirements are successfully created. No content returned.',
            type: 'null',
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
    createManyRequirements,
  )

  app.get(
    '/pets',
    {
      schema: {
        summary: 'Fetch pets',
        description:
          'Endpoint to retrieve pets by city. Users can use this endpoint to fetch pets, with optional pagination.',
        tags: ['Pets'],
        security: [{ jwt: [] }],
        querystring: fetchPetsSearchParamsSchemaToJson,
        response: {
          200: {
            type: 'object',
            properties: {
              count: {
                type: 'number',
                description: 'total number of items on the list',
              },
              next: {
                type: 'number',
                description: 'next page',
                default: 2,
                nullable: true,
              },
              previous: {
                type: 'number',
                description: 'previous page',
                default: null,
                nullable: true,
              },
              page: {
                type: 'number',
                description: 'current page',
                default: 1,
              },
              totalPages: {
                type: 'number',
                description: 'total of pages',
                default: 5,
              },
              perPage: {
                type: 'number',
                description: 'number of items per page',
                default: 10,
              },
              paginationDisabled: {
                type: 'boolean',
                description: 'indicates if pagination is disabled',
                default: false,
              },
              results: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    petAge: {
                      type: 'string',
                      enum: [
                        'NEWBORN',
                        'INFANT',
                        'JUVENILE',
                        'ADOLESCENT',
                        'YOUNG',
                        'ADULT',
                        'MATURE',
                        'SENIOR',
                        'ELDERLY',
                        'GERIATRIC',
                      ],
                    },
                    petImageUrl: { type: 'string' },
                    petSpecies: { type: 'string' },
                    petSize: {
                      type: 'string',
                      enum: ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'],
                    },
                    petEnergyLevel: {
                      type: 'string',
                      enum: ['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'],
                    },
                    petSuitableEnvironment: {
                      type: 'string',
                      enum: [
                        'AMPLE_SPACE',
                        'SMALL_APARTMENT',
                        'BACKYARD',
                        'INDOOR',
                        'OUTDOOR',
                        'RURAL_ENVIRONMENT',
                        'URBAN_ENVIRONMENT',
                      ],
                    },
                    petIndependenceLevel: {
                      type: 'string',
                      enum: ['LOW', 'MEDIUM', 'HIGH'],
                    },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                    organizationId: { type: 'string', nullable: true },
                  },
                  required: [
                    'id',
                    'name',
                    'petAge',
                    'petImageUrl',
                    'petSpecies',
                    'petSize',
                    'createdAt',
                    'updatedAt',
                  ],
                },
              },
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
    fetchPets,
  )

  app.get(
    '/pets/:petId',
    {
      schema: {
        summary: 'Get pet by id',
        description: 'Endpoint to retrieve pet details by id',
        tags: ['Pets'],
        security: [{ jwt: [] }],
        params: GetPetParamsSchemaToJson,
        response: {
          200: {
            type: 'object',
            properties: {
              pet: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  petAge: {
                    type: 'string',
                    enum: [
                      'NEWBORN',
                      'INFANT',
                      'JUVENILE',
                      'ADOLESCENT',
                      'YOUNG',
                      'ADULT',
                      'MATURE',
                      'SENIOR',
                      'ELDERLY',
                      'GERIATRIC',
                    ],
                  },
                  petImageUrl: { type: 'string' },
                  petSpecies: { type: 'string' },
                  petSize: {
                    type: 'string',
                    enum: ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'],
                  },
                  petEnergyLevel: {
                    type: 'string',
                    enum: ['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'],
                  },
                  petSuitableEnvironment: {
                    type: 'string',
                    enum: [
                      'AMPLE_SPACE',
                      'SMALL_APARTMENT',
                      'BACKYARD',
                      'INDOOR',
                      'OUTDOOR',
                      'RURAL_ENVIRONMENT',
                      'URBAN_ENVIRONMENT',
                    ],
                  },
                  petIndependenceLevel: {
                    type: 'string',
                    enum: ['LOW', 'MEDIUM', 'HIGH'],
                  },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                  organizationId: { type: 'string', nullable: true },
                },
                required: [
                  'id',
                  'name',
                  'petAge',
                  'petImageUrl',
                  'petSpecies',
                  'petSize',
                  'createdAt',
                  'updatedAt',
                ],
              },
              requirements: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                    petId: { type: 'string' },
                  },
                },
              },
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
    getPet,
  )
}
