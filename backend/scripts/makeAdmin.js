const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.update({
    where: { email: 'admin@seerr.com' },
    data: { role: 'ADMIN' },
  })
  console.log('Usuario actualizado:', user.name, '-', user.role)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())