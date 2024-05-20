import { PrismaService } from '@database/PrismaService';
import { Permission } from '@prisma/client';

class HandleUpdatePermission {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: number, permissions: Permission[]): Promise<void> {
    const permissionsFound: Permission[] = await this.prisma.permission.findMany({
      where: { name: { in: permissions as any } },
    });

    await this.prisma.user.update({ where: { id }, data: { permissions: { set: [] } } });

    await this.prisma.user.update({
      where: { id },
      data: { permissions: { connect: permissionsFound } },
    });
  }
}

export default new HandleUpdatePermission(new PrismaService());
