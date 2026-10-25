import { Role } from '@prisma/client';

export interface SessionData {
  uuid: string;
  role: Role;
}
