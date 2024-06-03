import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { Status, User } from '@prisma/client';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { LoginService } from '../login/login.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginService: LoginService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userArg: User): Promise<UserToken> {
    const payload: UserPayload = {
      id: userArg.id,
      role: userArg.role,
    };

    const token: string = this.jwtService.sign(payload);
    const user = await this.loginService.findByEmail(userArg.email);

    return { token, id: user.id, role: user.role, permissions: user.permissions };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.loginService.findByEmail(email);

    if (user && user.status === Status.ATIVO) {
      const isPasswordValid: boolean = compareSync(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new Error('Acesso não autorizado.');
  }
}
