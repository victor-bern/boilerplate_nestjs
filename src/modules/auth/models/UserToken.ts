import { Permission, Role } from '@prisma/client';

export interface UserToken {
  token: string;
  id: number;
  role: Role;
  permissions: Permission[];
}
