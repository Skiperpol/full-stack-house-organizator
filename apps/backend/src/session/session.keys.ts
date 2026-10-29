export const SESSION_KEY_PREFIX = 'sess:';
export const USER_SESSIONS_KEY_PREFIX = 'user:session:';

export function toSessionKey(sessionId: string): string {
  return sessionId.startsWith(SESSION_KEY_PREFIX)
    ? sessionId
    : `${SESSION_KEY_PREFIX}${sessionId}`;
}

export function toUserSessionKey(userId: number | string): string {
  const idStr = String(userId);
  return idStr.startsWith(USER_SESSIONS_KEY_PREFIX)
    ? idStr
    : `${USER_SESSIONS_KEY_PREFIX}${idStr}`;
}
