import { FastifyReply, FastifyRequest } from 'fastify'

export function register(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send({ message: 'Hello world' })
}
