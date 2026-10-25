import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from '@/session/session.service';
import { UnauthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UnauthenticatedRequest>();

    const sessionId = request.cookies?.['sessionId'];

    if (!sessionId) {
      throw new UnauthorizedException('Brak aktywnej sesji (brak ciasteczka)');
    }

    const sessionData = await this.sessionService.getSessionData(sessionId);

    if (!sessionData) {
      throw new UnauthorizedException('Sesja wygasła lub jest nieprawidłowa');
    }

    request.user = sessionData;
    request.sessionId = sessionId;

    return true;
  }
}
