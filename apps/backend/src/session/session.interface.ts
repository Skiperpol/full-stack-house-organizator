import { Role } from '@prisma/client';

export interface SessionData {
  id: number;
  uuid: string;
  role: Role;
}
