import { PrismaService } from '@database/PrismaService';
import { ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CheckAdminsDto } from 'src/modules/admin/settings-admin/dto/check-admins-dto';
import { UpdateAdminDto } from 'src/modules/admin/settings-admin/dto/update-admin.dto';

class HandleUpdateUser {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: number, payload: UpdateAdminDto): Promise<void> {
    const { document, email, phone } = payload;

    const checkAdminByEmail = await this.checkExistingUser({ email });
    const checkAdminByDocument = await this.checkExistingUser({ document });
    const checkAdminByPhone = await this.checkExistingUser({ phone });

    const allowsChanges: boolean =
      (checkAdminByEmail && checkAdminByEmail.id !== id) ||
      (checkAdminByDocument && checkAdminByDocument.id !== id) ||
      (checkAdminByPhone && checkAdminByPhone.id !== id);

    if (allowsChanges) {
      throw new ConflictException('Já existe usuário cadastrado com esses dados');
    }
  }

  private async checkExistingUser(payload: CheckAdminsDto): Promise<User> {
    const { document, email, phone } = payload;

    const user: User | null = await this.prisma.user.findFirst({
      where: { OR: [{ document }, { email }, { phone }] },
    });

    return user;
  }
}

export default new HandleUpdateUser(new PrismaService());
