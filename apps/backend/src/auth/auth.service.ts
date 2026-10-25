import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service.js';
import * as bcrypt from 'bcrypt';
import { SessionService } from '@/session/session.service.js';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Role } from '@prisma/client';
import { User } from '@prisma/client';
import { UserEntity } from '@/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
  ) {}

  async register(createUserDto: CreateUserDto, role: Role = Role.USER) {
    const user = await this.usersService.create(createUserDto, role);
    const sessionId = await this.sessionService.createSession({
      uuid: user.uuid,
      role: user.role,
    });

    return {
      sessionId,
      user: new UserEntity(user),
    };
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    const sessionId = await this.sessionService.createSession({
      uuid: user.uuid,
      role: user.role,
    });

    return {
      sessionId,
      user: new UserEntity(user),
    };
  }

  async getMe(uuid: string): Promise<UserEntity> {
    const user = await this.usersService.findByUUID(uuid);

    if (!user) {
      throw new UnauthorizedException('Użytkownik nie istnieje');
    }

    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmailWithPassword(email);

    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async logout(sessionId: string, uuid: string): Promise<void> {
    await this.sessionService.logout(sessionId, uuid);
  }

  async logoutFromAllDevices(uuid: string): Promise<void> {
    await this.sessionService.logoutFromAllDevices(uuid);
  }
}
