import { Organization } from '@prisma/client'

export interface OrganizationRepository {
  findById(id: string): Promise<Organization | null>
}
