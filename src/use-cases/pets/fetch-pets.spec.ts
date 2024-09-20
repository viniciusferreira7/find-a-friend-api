import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrganizationsRepository } from '@/repositories/organizations/in-memory-organizations-repository'
import { generatePets } from '@/utils/generate-pets'

import { FetchPetsUseCase } from './fetch-pets'

let organizationsRepository: InMemoryOrganizationsRepository
let sut: FetchPetsUseCase

describe('Fetch pets use case', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository()
    sut = new FetchPetsUseCase(organizationsRepository)
  })

  it('should be able to fetch pets by state and city', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      street: 'Street A',
      number: 1234,
      complement: 'Complement A',
      city: 'City A',
      state: 'State A',
      cellPhoneNumber: '123456789',
      cep: '123456789',
    })

    const organization2 = await organizationsRepository.create({
      managerName: 'Jana Doe',
      email: 'jana.doe@example.org',
      passwordHash: await hash('654123', 6),
      street: 'Street B',
      number: 1234,
      complement: 'Complement B',
      city: 'City B',
      state: 'State B',
      cellPhoneNumber: '98745654123',
      cep: '987654321',
    })

    const pets = generatePets({
      organizationIds: [organization.id, organization2.id],
    })

    pets.forEach((pet) => {
      organizationsRepository.pets.push(pet)
    })

    const response = await sut.execute({
      searchParams: {
        city: 'City B',
        state: 'State B',
      },
      paginationDisabled: true,
    })

    expect(
      response.results.every((item) => item.organizationId === organization.id),
    ).toBe(false)
    expect(
      response.results.every(
        (item) => item.organizationId === organization2.id,
      ),
    ).toBe(true)
  })

  it('should be able to fetch pets where response is paginated', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      street: 'Street A',
      number: 1234,
      complement: 'Complement A',
      city: 'City A',
      state: 'State A',
      cellPhoneNumber: '123456789',
      cep: '123456789',
    })

    const organization2 = await organizationsRepository.create({
      managerName: 'Jana Doe',
      email: 'jana.doe@example.org',
      passwordHash: await hash('654123', 6),
      street: 'Street B',
      number: 1234,
      complement: 'Complement B',
      city: 'City B',
      state: 'State B',
      cellPhoneNumber: '98745654123',
      cep: '987654321',
    })

    const pets = generatePets({
      organizationIds: [organization.id, organization2.id],
    })

    pets.forEach((pet) => {
      organizationsRepository.pets.push(pet)
    })

    const response = await sut.execute({
      searchParams: {
        city: 'City B',
        state: 'State B',
      },
    })

    expect(response.count).gt(0)
    expect(response.previous).toBe(null)
    expect(response.page).toEqual(1)
    expect(response.next).gte(1)
    expect(response.perPage).toEqual(10)
    expect(response.paginationDisabled).toBe(false)
    expect(response.results).toEqual(expect.any(Array))
    expect(response.results).length(10)
  })

  it('should be able to fetch pets where response is not paginated', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      street: 'Street A',
      number: 1234,
      complement: 'Complement A',
      city: 'City A',
      state: 'State A',
      cellPhoneNumber: '123456789',
      cep: '123456789',
    })

    const organization2 = await organizationsRepository.create({
      managerName: 'Jana Doe',
      email: 'jana.doe@example.org',
      passwordHash: await hash('654123', 6),
      street: 'Street B',
      number: 1234,
      complement: 'Complement B',
      city: 'City B',
      state: 'State B',
      cellPhoneNumber: '98745654123',
      cep: '987654321',
    })

    const pets = generatePets({
      organizationIds: [organization.id, organization2.id],
    })

    pets.forEach((pet) => {
      organizationsRepository.pets.push(pet)
    })

    const response = await sut.execute({
      searchParams: {
        city: 'City B',
        state: 'State B',
      },
      paginationDisabled: true,
    })

    expect(response.count).gt(0)
    expect(response.previous).toBe(null)
    expect(response.page).toEqual(1)
    expect(response.next).toBe(null)
    expect(response.perPage).gt(0)
    expect(response.paginationDisabled).toBe(true)
    expect(response.results).toEqual(expect.any(Array))
    expect(response.results.length).toBeGreaterThanOrEqual(1)
  })

  it('should be able to fetch pets by age', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      street: 'Street A',
      number: 1234,
      complement: 'Complement A',
      city: 'City A',
      state: 'State A',
      cellPhoneNumber: '123456789',
      cep: '123456789',
    })

    const organization2 = await organizationsRepository.create({
      managerName: 'Jana Doe',
      email: 'jana.doe@example.org',
      passwordHash: await hash('654123', 6),
      street: 'Street B',
      number: 1234,
      complement: 'Complement B',
      city: 'City B',
      state: 'State B',
      cellPhoneNumber: '98745654123',
      cep: '987654321',
    })

    const pets = generatePets({
      organizationIds: [organization.id, organization2.id],
    })

    pets.forEach((pet) => {
      organizationsRepository.pets.push(pet)
    })

    const response = await sut.execute({
      searchParams: {
        city: 'City B',
        state: 'State B',
        age: 'ADOLESCENT',
      },
      paginationDisabled: true,
    })

    expect(response.results.every((item) => item.petAge === 'ADOLESCENT')).toBe(
      true,
    )
    expect(response.results.every((item) => item.petAge !== 'ADOLESCENT')).toBe(
      false,
    )
  })

  it('should be able to fetch pets by age and energy level', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      street: 'Street A',
      number: 1234,
      complement: 'Complement A',
      city: 'City A',
      state: 'State A',
      cellPhoneNumber: '123456789',
      cep: '123456789',
    })

    const organization2 = await organizationsRepository.create({
      managerName: 'Jana Doe',
      email: 'jana.doe@example.org',
      passwordHash: await hash('654123', 6),
      street: 'Street B',
      number: 1234,
      complement: 'Complement B',
      city: 'City B',
      state: 'State B',
      cellPhoneNumber: '98745654123',
      cep: '987654321',
    })

    const pets = generatePets({
      organizationIds: [organization.id, organization2.id],
    })

    pets.forEach((pet) => {
      organizationsRepository.pets.push(pet)
    })

    const response = await sut.execute({
      searchParams: {
        city: 'City B',
        state: 'State B',
        age: 'ADOLESCENT',
        energyLevel: 'HIGH',
      },
      paginationDisabled: true,
    })

    expect(response.results.every((item) => item.petAge === 'ADOLESCENT')).toBe(
      true,
    )
    expect(response.results.every((item) => item.petAge !== 'ADOLESCENT')).toBe(
      false,
    )

    expect(
      response.results.every((item) => item.petEnergyLevel === 'HIGH'),
    ).toBe(true)
    expect(
      response.results.every((item) => item.petEnergyLevel !== 'HIGH'),
    ).toBe(false)
  })

  it('should be able to fetch pets by energy level and size', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      street: 'Street A',
      number: 1234,
      complement: 'Complement A',
      city: 'City A',
      state: 'State A',
      cellPhoneNumber: '123456789',
      cep: '123456789',
    })

    const organization2 = await organizationsRepository.create({
      managerName: 'Jana Doe',
      email: 'jana.doe@example.org',
      passwordHash: await hash('654123', 6),
      street: 'Street B',
      number: 1234,
      complement: 'Complement B',
      city: 'City B',
      state: 'State B',
      cellPhoneNumber: '98745654123',
      cep: '987654321',
    })

    const pets = generatePets({
      organizationIds: [organization.id, organization2.id],
    })

    pets.forEach((pet) => {
      organizationsRepository.pets.push(pet)
    })

    const response = await sut.execute({
      searchParams: {
        city: 'City B',
        state: 'State B',
        energyLevel: 'HIGH',
        size: 'EXTRA_LARGE',
      },
      paginationDisabled: true,
    })

    expect(
      response.results.every((item) => item.petEnergyLevel === 'HIGH'),
    ).toBe(true)
    expect(
      response.results.every((item) => item.petEnergyLevel !== 'HIGH'),
    ).toBe(false)

    expect(
      response.results.every((item) => item.petSize === 'EXTRA_LARGE'),
    ).toBe(true)
    expect(
      response.results.every((item) => item.petSize !== 'EXTRA_LARGE'),
    ).toBe(false)
  })
  it('should be able to fetch pets by size and independence level', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      street: 'Street A',
      number: 1234,
      complement: 'Complement A',
      city: 'City A',
      state: 'State A',
      cellPhoneNumber: '123456789',
      cep: '123456789',
    })

    const organization2 = await organizationsRepository.create({
      managerName: 'Jana Doe',
      email: 'jana.doe@example.org',
      passwordHash: await hash('654123', 6),
      street: 'Street B',
      number: 1234,
      complement: 'Complement B',
      city: 'City B',
      state: 'State B',
      cellPhoneNumber: '98745654123',
      cep: '987654321',
    })

    const pets = generatePets({
      organizationIds: [organization.id, organization2.id],
    })

    pets.forEach((pet) => {
      organizationsRepository.pets.push(pet)
    })

    const response = await sut.execute({
      searchParams: {
        city: 'City B',
        state: 'State B',
        energyLevel: 'HIGH',
        size: 'EXTRA_LARGE',
      },
      paginationDisabled: true,
    })

    expect(
      response.results.every((item) => item.petEnergyLevel === 'HIGH'),
    ).toBe(true)
    expect(
      response.results.every((item) => item.petEnergyLevel !== 'HIGH'),
    ).toBe(false)

    expect(
      response.results.every((item) => item.petSize === 'EXTRA_LARGE'),
    ).toBe(true)
    expect(
      response.results.every((item) => item.petSize !== 'EXTRA_LARGE'),
    ).toBe(false)
  })

  it('should be able to fetch pets by species', async () => {
    const organization = await organizationsRepository.create({
      managerName: 'John Doe',
      email: 'john.doe@example.org',
      passwordHash: await hash('123456', 6),
      street: 'Street A',
      number: 1234,
      complement: 'Complement A',
      city: 'City A',
      state: 'State A',
      cellPhoneNumber: '123456789',
      cep: '123456789',
    })

    const organization2 = await organizationsRepository.create({
      managerName: 'Jana Doe',
      email: 'jana.doe@example.org',
      passwordHash: await hash('654123', 6),
      street: 'Street B',
      number: 1234,
      complement: 'Complement B',
      city: 'City B',
      state: 'State B',
      cellPhoneNumber: '98745654123',
      cep: '987654321',
    })

    const pets = generatePets({
      organizationIds: [organization.id, organization2.id],
    })

    pets.forEach((pet) => {
      organizationsRepository.pets.push(pet)
    })

    const response = await sut.execute({
      searchParams: {
        city: 'City B',
        state: 'State B',
        size: 'SMALL',
        independenceLevel: 'HIGH',
      },
      paginationDisabled: true,
    })

    expect(response.results.every((item) => item.petSize === 'SMALL')).toBe(
      true,
    )
    expect(response.results.every((item) => item.petSize !== 'SMALL')).toBe(
      false,
    )

    expect(
      response.results.every((item) => item.petIndependenceLevel === 'HIGH'),
    ).toBe(true)
    expect(
      response.results.every((item) => item.petIndependenceLevel !== 'HIGH'),
    ).toBe(false)
  })
})
