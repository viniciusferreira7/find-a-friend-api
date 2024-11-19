import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory-organizations-repository'
import { generateOrganizations } from '@/utils/test/generate-organizations'

import { ResourceNotFound } from '../_errors/resource-not-found'
import { GetOrganizationUseCase } from './get-organization'

let organizationRepository: InMemoryOrganizationsRepository
let sut: GetOrganizationUseCase

describe('Get organization', () => {
  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationsRepository()
    sut = new GetOrganizationUseCase(organizationRepository)
  })

  it('should be able to get organization', async () => {
    const organizations = await generateOrganizations({
      passwordHashed: true,
      length: 10,
    })

    const [insertOrganization] = await Promise.all(
      organizations.map(async (item) => {
        return organizationRepository.create(item)
      }),
    )

    const { organization: organizationFound } = await sut.execute({
      organizationId: insertOrganization.id,
    })

    expect(organizationFound).toEqual(
      expect.objectContaining({
        id: insertOrganization.id,
        managerName: insertOrganization.managerName,
        email: insertOrganization.email,
        passwordHash: insertOrganization.passwordHash,
        cep: insertOrganization.cep,
        street: insertOrganization.street,
        number: insertOrganization.number,
        complement: insertOrganization.complement,
        city: insertOrganization.city,
        state: insertOrganization.state,
        role: insertOrganization.role,
        cellPhoneNumber: insertOrganization.cellPhoneNumber,
        createdAt: insertOrganization.createdAt,
        updatedAt: insertOrganization.updatedAt,
      }),
    )
  })
  it('should not be able to get organization with wrong id', async () => {
    await expect(
      sut.execute({
        organizationId: 'wrong-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
