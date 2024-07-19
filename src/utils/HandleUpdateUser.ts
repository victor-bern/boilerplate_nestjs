import { PrismaService } from '@database/PrismaService';
import { ConflictException } from '@nestjs/common';
import { UpdateAdminDto } from 'src/modules/admin/admin-settings/dto/update-admin.dto';
import { checkExistingUser } from './checkExistingUser';

class HandleUpdateUser {
  constructor(private readonly prisma: PrismaService) {}

  async updateAdmin(id: number, payload: UpdateAdminDto): Promise<void> {
    const { document, email, phone } = payload;

    const checkAdminByEmail = await checkExistingUser({ email }, true);
    const checkAdminByDocument = await checkExistingUser({ document }, true);
    const checkAdminByPhone = await checkExistingUser({ phone }, true);

    const allowsChanges: boolean =
      (checkAdminByEmail && checkAdminByEmail.id !== id) ||
      (checkAdminByDocument && checkAdminByDocument.id !== id) ||
      (checkAdminByPhone && checkAdminByPhone.id !== id);

    if (allowsChanges) {
      throw new ConflictException('Já existe usuário cadastrado com esses dados');
    }
  }
}

export default new HandleUpdateUser(new PrismaService());
