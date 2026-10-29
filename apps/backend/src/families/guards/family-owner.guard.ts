import { PrismaService } from '@/prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FamilyRole } from '@prisma/client';

@Injectable()
export class FamilyOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const familyUuid = request.params?.uuid;

    if (!userId || !familyUuid) {
      return false;
    }

    const family = await this.prisma.family.findUnique({
      where: { uuid: familyUuid },
      select: {
        id: true,
        members: {
          where: { userId },
          select: { role: true },
        },
      },
    });

    if (!family) {
      throw new NotFoundException('Family not found');
    }

    const userMember = family.members[0];
    if (!userMember || userMember.role !== FamilyRole.OWNER) {
      throw new ForbiddenException(
        'Only the family owner can perform this action',
      );
    }

    request.familyId = family.id;

    return true;
  }
}
