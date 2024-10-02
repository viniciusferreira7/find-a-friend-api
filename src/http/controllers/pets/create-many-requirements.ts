import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { makeCreateManyRequirementsUseCase } from '@/factories/pets/make-create-many-requirements-use-case'
import { ResourceNotFound } from '@/use-cases/_errors/resource-not-found'

const CreateManyRequirementsParamsSchema = z.object({
  petId: z.string().uuid(),
})

export const CreateManyRequirementsParamsSchemaToJson = zodToJsonSchema(
  CreateManyRequirementsParamsSchema,
)

const CreateManyRequirementsBodySchema = z.object({
  requirements: z.array(
    z.object({
      name: z.string(),
    }),
  ),
})

export const CreateManyRequirementsBodySchemaToJson = zodToJsonSchema(
  CreateManyRequirementsBodySchema,
)

export async function createManyRequirements(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { petId } = CreateManyRequirementsParamsSchema.parse(request.params)
  const { requirements } = CreateManyRequirementsBodySchema.parse(request.body)

  try {
    const createManyRequirementsUseCase = makeCreateManyRequirementsUseCase()

    await createManyRequirementsUseCase.execute({
      organizationId: request.user.sub,
      petId,
      requirements,
    })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}
