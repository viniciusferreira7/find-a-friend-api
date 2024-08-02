import { randomUUID } from 'node:crypto'

import { Organization, Prisma } from '@prisma/client'

import { OrganizationsRepository } from '../organizations-repository'

export class InMemoryOrganizationsRepository
  implements OrganizationsRepository
{
  public organizations: Organization[] = []

  async findById(id: string): Promise<Organization | null> {
    const organization = this.organizations.find((item) => item.id === id)

    if (!organization) {
      return null
    }

    return organization
  }

  async create(
    data: Prisma.OrganizationUncheckedCreateInput,
  ): Promise<Organization> {
    const organization: Organization = {
      id: data.id ?? randomUUID(),
      managerName: data.managerName,
      email: data.email,
      passwordHash: data.passwordHash,
      street: data.street,
      number: data.number,
      complement: data.complement,
      city: data.city,
      state: data.state,
      cellPhoneNumber: data.cellPhoneNumber,
      cep: data.cep,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.organizations.push(organization)

    return organization
  }
}
