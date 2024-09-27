import { faker } from '@faker-js/faker'
import { Organization } from '@prisma/client'
import { hash } from 'bcryptjs'
import chalk from 'chalk'

import { prisma } from '@/lib/prisma'
import { generatePets } from '@/utils/generate-pets'
import { generateOrganizations } from '@/utils/test/generate-organizations'

async function seed() {
  const tableNames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  const tables = tableNames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ')

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
    tables.split(',').forEach((tableName) => {
      console.log(chalk.greenBright(`Trucante table: ${tableName}  ✔️`))
    })
  } catch (error) {
    console.log({ error })
  }

  // Create Organizations

  const dateOfCreationOfOrganization = faker.date.recent({
    days: 30,
  })

  const organization: Organization = {
    id: faker.string.uuid(),
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
    role: 'ADMIN',
  }

  const organizations = await generateOrganizations({ passwordHashed: true })

  await prisma.organization.createMany({
    data: [organization, ...organizations],
  })

  console.log(chalk.yellowBright('Created organizations ✔️'))

  // Register Pets

  await prisma.pet.createMany({
    data: generatePets({
      organizationIds: organizations.map((item) => item.id),
    }),
  })

  console.log(chalk.yellowBright('Registered pets ✔️'))
}

seed().then(() => {
  console.log(chalk.greenBright('Database seeded ✔️'))
  prisma.$disconnect()
})
