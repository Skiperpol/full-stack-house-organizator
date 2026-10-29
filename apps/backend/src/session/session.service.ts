import { RedisService } from '@/redis/redis.service';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { toSessionKey, toUserSessionKey } from './session.keys';
import { SessionData } from './session.interface';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  private readonly SESSION_TTL = 86400; // 24h
  private readonly SET_SESSION_TTL = this.SESSION_TTL * 7; // 7 dni
  private readonly REFRESH_THRESHOLD = 43200; // 12h

  constructor(private readonly redisService: RedisService) {}

  async createSession(sessionData: SessionData): Promise<string> {
    const rawSessionId = randomUUID();
    const sessionKey = toSessionKey(rawSessionId);
    const userSessionsKey = toUserSessionKey(sessionData.id);

    await this.redisService.setJson(sessionKey, sessionData, this.SESSION_TTL);
    await this.redisService.addToSet(
      userSessionsKey,
      sessionKey,
      this.SET_SESSION_TTL,
    );

    return rawSessionId;
  }

  async getSessionData(sessionId: string): Promise<SessionData | null> {
    const sessionKey = toSessionKey(sessionId);

    const sessionData =
      await this.redisService.getJson<SessionData>(sessionKey);
    if (!sessionData) return null;

    this.refreshSessionIfNeeded(sessionKey, sessionData.id).catch((err) => {
      this.logger.error(
        `Failed to refresh session TTL for key: ${sessionKey}`,
        err,
      );
    });

    return sessionData;
  }

  private async refreshSessionIfNeeded(
    sessionKey: string,
    userId: number,
  ): Promise<void> {
    const remainingTtl = await this.redisService.getTtl(sessionKey);

    if (remainingTtl > 0 && remainingTtl < this.REFRESH_THRESHOLD) {
      const userSessionsKey = toUserSessionKey(userId);

      await Promise.all([
        this.redisService.expire(sessionKey, this.SESSION_TTL),
        this.redisService.expire(userSessionsKey, this.SET_SESSION_TTL),
      ]);
    }
  }
  async logout(sessionId: string, userId: number): Promise<void> {
    const sessionKey = toSessionKey(sessionId);
    const userSessionsKey = toUserSessionKey(userId);

    await Promise.all([
      this.redisService.del(sessionKey),
      this.redisService.removeFromSet(userSessionsKey, sessionKey),
    ]);
  }

  async logoutFromAllDevices(userId: number): Promise<void> {
    const userSessionsKey = toUserSessionKey(userId);
    const sessionKeys = await this.redisService.getSetMembers(userSessionsKey);

    await this.redisService.del(...sessionKeys, userSessionsKey);
  }
}
