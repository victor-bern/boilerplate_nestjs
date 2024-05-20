import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@database/PrismaService';
import { Permission, Role, Status, User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { CreateAdminDto } from './dto/CreateAdminDto';
import { CreateAdminResponseDto } from './dto/CreateAdminResponseDto';
import { QueryAdminDto } from './dto/QueryAdminDto';
import { ResponseFindAllAdminDto } from './dto/ResponseFindAllAdminDto';
import { UpdateAdminDto } from './dto/UpdateAdminDto';
import capitalizeFirstLetter from '@utils/capitalizeFirstLetter';
import HandleUpdateUser from '@utils/HandleUpdateUser';
import handleUpdatePermission from '@utils/HandleUpdatePermission';
import { checkExistingUser } from '@utils/checkExistingUser';

@Injectable()
export class SettingsAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateAdminDto): Promise<CreateAdminResponseDto> {
    const { name, document, email, phone, password, permissions, fileUrl, fileKey } = payload;

    await checkExistingUser({ document, email, phone });

    const validNewAdmin = {
      name: capitalizeFirstLetter(name),
      email,
      document,
      phone,
      password: hashSync(password, 10),
      fileUrl,
      fileKey,
      role: Role.ADMIN,
      status: Status.ATIVO,
    };

    const permissionsFound: Permission[] = await this.prisma.permission.findMany({
      where: { name: { in: permissions as any } },
    });

    const user: Partial<User> = await this.prisma.user.create({
      data: { ...validNewAdmin, permissions: { connect: permissionsFound } },
    });

    return { message: 'Admin cadastrado com sucesso.', admin: await this.findById(user.id) };
  }

  findAllPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany();
  }

  async findAll(query: QueryAdminDto): Promise<ResponseFindAllAdminDto> {
    const { name, status, take, skip } = query;

    const admins: Partial<User>[] = await this.prisma.user.findMany({
      where: {
        OR: [{ role: Role.MASTER }, { role: Role.ADMIN }],
        name: { contains: name },
        status: status as Status,
      },
      select: {
        id: true,
        name: true,
        email: true,
        document: true,
        phone: true,
        role: true,
        status: true,
        fileUrl: true,
        fileKey: true,
        createdAt: true,
        updatedAt: true,
      },
      take: Number(take) || 10,
      skip: (Number(skip) - 1) * Number(take) || 0,
    });

    const allAdmins = await this.prisma.user.findMany({
      where: { OR: [{ role: Role.MASTER }, { role: Role.ADMIN }] },
    });

    const pages: number = skip ? Math.ceil(allAdmins.length / take) : 1;

    return { admins, pages, count: allAdmins.length };
  }

  async findById(id: number): Promise<Partial<User>> {
    const user: Partial<User> = await this.prisma.user.findUnique({
      where: { id, OR: [{ role: Role.MASTER }, { role: Role.ADMIN }] },
      select: {
        id: true,
        name: true,
        email: true,
        document: true,
        phone: true,
        role: true,
        status: true,
        fileUrl: true,
        fileKey: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('Admin não encontrado.');

    return user;
  }

  async update(id: number, payload: UpdateAdminDto): Promise<Partial<User>> {
    await this.findById(id);

    const { name, document, email, phone, password, status, permissions } = payload;

    await HandleUpdateUser.update(id, payload);

    if (permissions) await handleUpdatePermission.update(id, permissions);

    await this.prisma.user.update({
      where: { id },
      data: {
        name: name ? capitalizeFirstLetter(name) : undefined,
        password: password ? hashSync(password, 10) : undefined,
        status: status ? (status as Status) : undefined,
        document,
        email,
        phone,
        fileUrl: payload.fileUrl,
        fileKey: payload.fileKey,
      },
    });

    const adminUpdated: Partial<User> = await this.findById(id);

    return adminUpdated;
  }
}
