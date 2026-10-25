import { SessionData } from '@/session/session.interface';
import { Request } from 'express';

export interface UnauthenticatedRequest extends Request {
  user?: SessionData;
  sessionId?: string;
}

export interface AuthenticatedRequest extends Request {
  user: SessionData;
  sessionId: string;
}
