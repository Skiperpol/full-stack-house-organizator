export const SESSION_KEY_PREFIX = 'sess:';
export const USER_SESSIONS_KEY_PREFIX = 'user_session:';

export function toSessionKey(sessionId: string): string {
  return sessionId.startsWith(SESSION_KEY_PREFIX)
    ? sessionId
    : `${SESSION_KEY_PREFIX}${sessionId}`;
}

export function toUserSessionKey(uuid: string): string {
  return uuid.startsWith(USER_SESSIONS_KEY_PREFIX)
    ? uuid
    : `${USER_SESSIONS_KEY_PREFIX}${uuid}`;
}
