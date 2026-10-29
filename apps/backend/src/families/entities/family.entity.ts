import { Family, FamilyInvite, FamilyMember } from '@prisma/client';

export class FamilyEntity implements Family {
  id: number;
  uuid: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  members?: FamilyMember[];
  invites?: FamilyInvite[];
}
