import { createHash, timingSafeEqual } from 'node:crypto';

// One user, one password (SITE_PASSWORD). The cookie holds a hash derived from it,
// so changing the password logs every device out.
export const AUTH_COOKIE = 'ro_auth';
export const AUTH_MAX_AGE = 60 * 60 * 24 * 400; // ~13 months, the browser maximum

const sha = (s: string) => createHash('sha256').update(s).digest();

export const authEnabled = () => Boolean(process.env.SITE_PASSWORD);
export const sessionToken = () => sha(`ro-auth:${process.env.SITE_PASSWORD}`).toString('hex');

export function isAuthed(cookie: string | undefined): boolean {
  if (!authEnabled()) return true;
  if (!cookie) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(sessionToken());
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkPassword(password: string): boolean {
  return timingSafeEqual(sha(password), sha(process.env.SITE_PASSWORD ?? ''));
}
