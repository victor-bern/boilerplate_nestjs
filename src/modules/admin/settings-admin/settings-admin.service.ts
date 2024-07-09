import { PrismaService } from '@database/PrismaService';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminPermission, Role, Status, User } from '@prisma/client';
import capitalizeFirstLetter from '@utils/capitalizeFirstLetter';
import { checkExistingUser } from '@utils/checkExistingUser';
import handleUpdatePermission from '@utils/HandleUpdatePermission';
import HandleUpdateUser from '@utils/HandleUpdateUser';
import { hashSync } from 'bcrypt';
import { CreateAdminResponseDto } from './dto/create-admin-response.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { QueryAdminDto } from './dto/query-admin.dto';
import { ResponseFindAllAdminDto } from './dto/response-find-all-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class SettingsAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateAdminDto): Promise<CreateAdminResponseDto> {
    const { name, document, email, phone, password, adminPermissions, fileUrl, fileKey } = payload;

    await checkExistingUser({ document, email, phone });

    const validNewAdmin = {
      name: capitalizeFirstLetter(name),
      email,
      document,
      phone,
      password: hashSync(password, 10),
      fileUrl,
      fileKey,
      role: Role.Admin,
      status: Status.Ativo,
    };

    const permissionsFound: AdminPermission[] = await this.prisma.adminPermission.findMany({
      where: { name: { in: adminPermissions as any } },
    });

    const user: Partial<User> = await this.prisma.user.create({
      data: { ...validNewAdmin, adminPermissions: { connect: permissionsFound } },
    });

    return { message: 'Admin cadastrado com sucesso.', admin: await this.findById(user.id) };
  }

  findAllPermissions(): Promise<AdminPermission[]> {
    return this.prisma.adminPermission.findMany();
  }

  async findAll(query: QueryAdminDto): Promise<ResponseFindAllAdminDto> {
    const { name, status, take, skip } = query;

    const admins: Partial<User>[] = await this.prisma.user.findMany({
      where: {
        OR: [{ role: Role.Master }, { role: Role.Admin }],
        name: { contains: name },
        status,
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
      where: {
        OR: [{ role: Role.Master }, { role: Role.Admin }],
        name: { contains: name },
        status,
      },
    });

    const pages: number = skip ? Math.ceil(allAdmins.length / take) : 1;

    return { admins, pages, count: allAdmins.length };
  }

  async findById(id: number): Promise<Partial<User>> {
    const user: Partial<User> = await this.prisma.user.findUnique({
      where: { id, OR: [{ role: Role.Master }, { role: Role.Admin }] },
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
        adminPermissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('Admin não encontrado.');

    return user;
  }

  async update(id: number, payload: UpdateAdminDto): Promise<Partial<User>> {
    await this.findById(id);

    const { name, document, email, phone, password, status, adminPermissions } = payload;

    await HandleUpdateUser.update(id, payload);

    if (adminPermissions) await handleUpdatePermission.update(id, adminPermissions);

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
