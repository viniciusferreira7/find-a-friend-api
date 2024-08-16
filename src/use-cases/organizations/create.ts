import { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'

import { OrganizationsRepository } from '@/repositories/organizations-repository'

import { EmailAlreadyUsed } from '../errors/email-already-exist'

interface CreateUseCaseRequest {
  managerName: string
  email: string
  password: string
  cep: string
  street: string
  number: number
  complement: string
  city: string
  state: string
  cellPhoneNumber: string
}

interface CreateUseCaseResponse {
  organization: Organization
}

export class CreateUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute(data: CreateUseCaseRequest): Promise<CreateUseCaseResponse> {
    const organization = await this.organizationsRepository.findByEmail(
      data.email,
    )

    if (organization) {
      throw new EmailAlreadyUsed()
    }

    const passwordHash = await hash(data.password, 6)

    const createdOrganization = await this.organizationsRepository.create({
      managerName: data.managerName,
      email: data.email,
      passwordHash,
      cep: data.cep,
      street: data.street,
      number: data.number,
      complement: data.complement,
      city: data.city,
      state: data.state,
      cellPhoneNumber: data.cellPhoneNumber,
    })

    return { organization: createdOrganization }
  }
}
