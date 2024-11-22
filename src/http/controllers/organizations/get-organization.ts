import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { makeGetOrganization } from '@/factories/organizations/make-get-organization'
import { ResourceNotFound } from '@/use-cases/_errors/resource-not-found'

const getOrganizationParamsSchema = z.object({
  id: z.string().uuid(),
})

export const getOrganizationParamsSchemaToJson = zodToJsonSchema(
  getOrganizationParamsSchema,
)

export async function getOrganization(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = getOrganizationParamsSchema.parse(request.params)

  try {
    const getOrganizationUseCase = makeGetOrganization()

    const { organization } = await getOrganizationUseCase.execute({
      organizationId: id,
    })

    return reply
      .status(200)
      .send({ organization: { ...organization, passwordHash: undefined } })
  } catch (err) {
    if (err instanceof ResourceNotFound) {
      return reply.status(401).send({ message: err.message })
    }
  }
}
