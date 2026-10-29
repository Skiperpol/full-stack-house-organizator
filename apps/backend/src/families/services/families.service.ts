import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFamilyDto } from '../dto/create-family.dto.js';
import { FamilyEntity } from '../entities/family.entity.js';
import { PrismaService } from '@/prisma/prisma.service.js';
import { FamilyRole } from '@prisma/client';
import { UpdateFamilyDto } from '../dto/update-family.dto.js';

@Injectable()
export class FamiliesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createFamilyDto: CreateFamilyDto,
  ): Promise<FamilyEntity> {
    return this.prisma.family.create({
      data: {
        ...createFamilyDto,
        members: { create: { userId, role: FamilyRole.OWNER } },
      },
    });
  }

  async findAll(): Promise<FamilyEntity[]> {
    return await this.prisma.family.findMany();
  }

  async findAllByUserId(userId: number): Promise<FamilyEntity[]> {
    return this.prisma.family.findMany({
      where: { members: { some: { userId } } },
    });
  }

  async findOneByUuid(uuid: string, userId: number): Promise<FamilyEntity> {
    const family = await this.prisma.family.findFirst({
      where: {
        uuid,
        members: { some: { userId } },
      },
    });

    if (!family) {
      throw new NotFoundException('Family not found');
    }

    return family;
  }

  async update(
    uuid: string,
    userId: number,
    updateFamilyDto: UpdateFamilyDto,
  ): Promise<FamilyEntity> {
    await this.findOneByUuid(uuid, userId);

    return this.prisma.family.update({
      where: { uuid },
      data: updateFamilyDto,
    });
  }

  async remove(uuid: string): Promise<void> {
    await this.prisma.family.delete({
      where: { uuid },
    });
  }
}
