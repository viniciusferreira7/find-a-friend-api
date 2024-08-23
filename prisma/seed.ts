import { faker } from '@faker-js/faker'
import { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'
import chalk from 'chalk'

import { prisma } from '@/lib/prisma'

async function seed() {
  const tableNames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  const tables = tableNames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ')

  tables.split(',').forEach((tableName) => {
    console.log(chalk.greenBright(`Trucante table: ${tableName}  ✔️`))
  })

  const organizationId = '9d656623-c105-47f4-8cad-8b8d6fb9293f'

  const dateOfCreationOfOrganization = faker.date.recent({
    days: 30,
  })

  const organization: Organization = {
    id: organizationId,
    managerName: 'John Doe',
    email: 'john.doe@example.org',
    passwordHash: await hash('123456', 6),
    cep: '12345678',
    street: 'Elm Street',
    number: 1234,
    complement: 'Suite 5B',
    city: 'Springfield',
    state: 'IL',
    cellPhoneNumber: '12345678910',
    createdAt: dateOfCreationOfOrganization,
    updatedAt: dateOfCreationOfOrganization,
  }

  async function generateOthersOrganizations() {
    const organizations: Organization[] = await Promise.all(
      Array.from({ length: 20 }).map(async () => {
        const firstName = faker.person.firstName()

        return {
          id: faker.string.uuid(),
          managerName: faker.person.fullName({
            firstName,
          }),
          email: faker.internet.email({
            firstName,
          }),
          passwordHash: await hash(faker.internet.password({ length: 6 }), 6),
          cep: faker.number.int({ max: 8, min: 8 }).toString(),
          street: faker.location.street(),
          number: faker.number.int({ max: 7, min: 4 }),
          complement: faker.location.buildingNumber(),
          city: faker.location.city(),
          state: faker.location.state(),
          cellPhoneNumber: faker.number.int({ max: 15, min: 9 }).toString(),
          createdAt: faker.date.recent({
            days: 30,
          }),
          updatedAt: faker.date.recent({
            days: 18,
          }),
        }
      }),
    )

    return { organizations }
  }
}

seed().then(() => {
  console.log(chalk.greenBright('Database seeded ✔️'))
  prisma.$disconnect()
})
