import { Organization, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { OrganizationsRepository } from '../organizations-repository'

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  async findById(id: string): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({
      where: {
        id,
      },
    })

    return organization
  }

  async findByEmail(email: string): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({
      where: {
        email,
      },
    })

    return organization
  }

  async create(
    data: Prisma.OrganizationUncheckedCreateInput,
  ): Promise<Organization> {
    const organization = await prisma.organization.create({
      data: {
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
        role: 'ADMIN',
      },
    })

    return organization
  }
}
