import { PrismaClient, Role, Status } from '@prisma/client';
import { hashSync } from 'bcrypt';

export async function seedAdmin(prisma: PrismaClient) {
  await prisma.user.createMany({
    data: [
      {
        name: 'master',
        email: 'admin.master@email.com',
        password: hashSync('12345678', 10),
        role: Role.MASTER,
        status: Status.ATIVO,
      },
    ],
  });

  console.log('Seed admins success 🌱.');
}
