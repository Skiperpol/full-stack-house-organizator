import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserEntity } from './entities/user.entity.js';
import { PrismaService } from '@/prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
    role: Role = Role.USER,
  ): Promise<UserEntity> {
    const { email, password, name } = createUserDto;

    const isUserExists = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (isUserExists) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? new UserEntity(user) : null;
  }

  async findByUUID(uuid: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { uuid },
    });

    return user ? new UserEntity(user) : null;
  }
}
