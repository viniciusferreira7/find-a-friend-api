import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      role: 'ADMIN' | 'MEMBER'
    }
    user: {
      sub: string
      role: 'ADMIN' | 'MEMBER'
    }
  }
}
