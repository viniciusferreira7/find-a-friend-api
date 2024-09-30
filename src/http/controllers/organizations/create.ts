import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import { makeCreateUseCase } from '@/factories/organizations/make-create-use-case'
import { EmailAlreadyUsed } from '@/use-cases/_errors/email-already-exist'

const createBodySchema = z.object({
  managerName: z
    .string()
    .max(100, { message: 'Must be a maximum of 50 characters' }),
  email: z.string().email(),
  password: z.string().min(6, { message: 'Must have 6 or more characters' }),
  cep: z.string().max(8, { message: 'Must have 8 or more characters' }),
  street: z.string().max(20, { message: 'Must have 20 or more characters' }),
  number: z.coerce.number(),
  complement: z
    .string()
    .max(20, { message: 'Must have 20 or more characters' }),
  city: z.string().max(20, { message: 'Must have 20 or more characters' }),
  state: z.string().max(20, { message: 'Must have 20 or more characters' }),
  cellPhoneNumber: z
    .string()
    .max(15, { message: 'Must have 15 or more characters' }),
})

export const createBodyJsonSchema = zodToJsonSchema(createBodySchema)

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const {
    managerName,
    email,
    password,
    cep,
    street,
    number,
    complement,
    city,
    state,
    cellPhoneNumber,
  } = createBodySchema.parse(request.body)

  try {
    const createUseCase = makeCreateUseCase()

    await createUseCase.execute({
      managerName,
      email,
      password,
      cep,
      street,
      number,
      complement,
      city,
      state,
      cellPhoneNumber,
    })

    return reply.status(201).send()
  } catch (err) {
    if (err instanceof EmailAlreadyUsed) {
      return reply.status(400).send({ message: err.message })
    }
  }
}
