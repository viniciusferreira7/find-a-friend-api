import { Organization } from '@prisma/client'
import { compare } from 'bcryptjs'

import { OrganizationsRepository } from '@/repositories/organizations-repository'

import { InvalidCredentialsError } from '../_errors/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  organization: Organization
}

export class AuthenticateUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const organization = await this.organizationsRepository.findByEmail(email)

    if (!organization) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(
      password,
      organization.passwordHash,
    )

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return { organization }
  }
}
