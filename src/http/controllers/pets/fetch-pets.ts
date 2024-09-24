import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { makeFetchPetsUseCase } from '@/factories/organizations/make-fetch-pets-use-case'

const fetchPetsSearchParamsSchema = z.object({
  state: z.string(),
  city: z.string(),
  age: z
    .enum([
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
    ])
    .optional(),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE']).optional(),
  species: z.string().optional(),
  energy_level: z.enum(['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']).optional(),
  suitable_environment: z
    .enum([
      'AMPLE_SPACE',
      'SMALL_APARTMENT',
      'BACKYARD',
      'INDOOR',
      'OUTDOOR',
      'RURAL_ENVIRONMENT',
      'URBAN_ENVIRONMENT',
    ])
    .optional(),
  independence_level: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  page: z.coerce
    .number()
    .positive({ message: 'Must be the positive number.' })
    .default(1)
    .optional(),
  per_page: z.coerce
    .number()
    .positive({ message: 'Must be the positive number.' })
    .default(10)
    .optional(),
  pagination_disabled: z
    .union([z.string(), z.boolean()])
    .transform((val) => {
      if (typeof val === 'boolean') return val
      return val === 'true'
    })
    .default(false)
    .optional(),
})

export const fetchPetsSearchParamsSchemaToJson = zodToJsonSchema(
  fetchPetsSearchParamsSchema,
)

export async function fetchPets(request: FastifyRequest, reply: FastifyReply) {
  const searchParams = fetchPetsSearchParamsSchema.parse(request.query)

  const fetchUseCase = makeFetchPetsUseCase()

  const response = await fetchUseCase.execute({
    searchParams: {
      state: searchParams.state,
      city: searchParams.city,
      age: searchParams.age,
      energyLevel: searchParams.energy_level,
      size: searchParams.size,
      independenceLevel: searchParams.independence_level,
      species: searchParams.species,
    },
    page: searchParams.page,
    paginationDisabled: searchParams.pagination_disabled,
    perPage: searchParams.per_page,
  })

  return reply.status(200).send(response)
}
