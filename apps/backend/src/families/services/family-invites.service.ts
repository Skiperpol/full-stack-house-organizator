import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFamilyInviteDto } from '../dto/create-family-invite.dto.js';
import { FamilyInviteEntity } from '../entities/family-invite.entity.js';
import { PrismaService } from '@/prisma/prisma.service.js';

@Injectable()
export class FamilyInvitesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    invitedById: number,
    createFamilyInviteDto: CreateFamilyInviteDto,
  ): Promise<FamilyInviteEntity> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.familyInvite.create({
      data: {
        familyId: createFamilyInviteDto.familyId,
        invitedById,
        expiresAt,
      },
    });
  }

  async findAllByFamilyIdAndInvitedById(
    invitedById: number,
    createFamilyInviteDto: CreateFamilyInviteDto,
  ): Promise<FamilyInviteEntity[]> {
    return this.prisma.familyInvite.findMany({
      where: {
        familyId: createFamilyInviteDto.familyId,
        invitedById,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async remove(token: string, userId: number): Promise<void> {
    const invite = await this.prisma.familyInvite.findUnique({
      where: { token },
      select: { invitedById: true },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.invitedById !== userId) {
      throw new ForbiddenException('You are not allowed to cancel this invite');
    }

    await this.prisma.familyInvite.delete({
      where: { token },
    });
  }
}
