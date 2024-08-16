import { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'

import { OrganizationsRepository } from '@/repositories/organizations-repository'

import { OrganizationAlreadyExists } from '../errors/organization-already-exist'

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

  async execute({
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
  }: CreateUseCaseRequest): Promise<CreateUseCaseResponse> {
    const organization = await this.organizationsRepository.findByEmail(email)

    if (organization) {
      throw new OrganizationAlreadyExists()
    }

    const passwordHash = await hash(password, 6)

    const createdOrganization = await this.organizationsRepository.create({
      managerName,
      email,
      passwordHash,
      cep,
      street,
      number,
      complement,
      city,
      state,
      cellPhoneNumber,
    })

    return { organization: createdOrganization }
  }
}
