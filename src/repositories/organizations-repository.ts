import { Organization, Prisma } from '@prisma/client'

export interface OrganizationsRepository {
  findById(id: string): Promise<Organization | null>
  create(data: Prisma.OrganizationUncheckedCreateInput): Promise<Organization>
}
