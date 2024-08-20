import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

import { makeRegisterUseCase } from '@/factories/pets/make-register-use-case'
import { ResourceNotFound } from '@/use-cases/errors/resource-not-found'

const registerBodySchema = z.object({
  organizationId: z.string().uuid(),
  pet: z.object({
    name: z
      .string()
      .min(5, { message: 'The name must be at least 5 characters long' }),
    description: z
      .string()
      .min(30, 'The description must be at least 5 characters long'),
    age: z.enum([
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
    ]),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE']),
    species: z.string(),
    energyLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']),
    suitableEnvironment: z.enum([
      'AMPLE_SPACE',
      'SMALL_APARTMENT',
      'BACKYARD',
      'INDOOR',
      'OUTDOOR',
      'RURAL_ENVIRONMENT',
      'URBAN_ENVIRONMENT',
    ]),
    independenceLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    petImageUrl: z.string().url(),
  }),
})

export const registerBodyJsonSchema = zodToJsonSchema(registerBodySchema)

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const {
    organizationId,
    pet: {
      name,
      description,
      age,
      size,
      species,
      energyLevel,
      suitableEnvironment,
      independenceLevel,
      petImageUrl,
    },
  } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    const { pet } = await registerUseCase.execute({
      organizationId,
      pet: {
        name,
        description,
        age,
        size,
        species,
        energyLevel,
        suitableEnvironment,
        independenceLevel,
        petImageUrl,
      },
    })

    return reply.status(201).send({ petId: pet.id })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}
