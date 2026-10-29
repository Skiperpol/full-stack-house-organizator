import { Family, User, FamilyInvite } from '@prisma/client';

export class FamilyInviteEntity implements FamilyInvite {
  id: number;
  token: string;
  familyId: number;
  invitedById: number;
  expiresAt: Date;
  createdAt: Date;

  family?: Family;
  invitedBy?: User;
}
