import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { makeGetPetUseCase } from '@/factories/pets/make-get-pet'
import { ResourceNotFound } from '@/use-cases/_errors/resource-not-found'

const GetPetParamsSchema = z.object({
  petId: z.string().uuid(),
})

export const GetPetParamsSchemaToJson = zodToJsonSchema(GetPetParamsSchema)

export async function getPet(request: FastifyRequest, reply: FastifyReply) {
  const { petId } = GetPetParamsSchema.parse(request.params)

  try {
    const getPetUseCase = makeGetPetUseCase()

    const { pet, requirements } = await getPetUseCase.execute({
      petId,
    })

    return reply.status(200).send({ pet, requirements })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(404).send({ message: err.message })
    }
  }
}
