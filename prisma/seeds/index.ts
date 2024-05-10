import { PrismaClient } from '@prisma/client';
import { seedAdmin } from './admin.seeds';
import { seedUser } from './user.seeds';

const prisma = new PrismaClient();

async function main() {
  await seedAdmin(prisma);
  await seedUser(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
