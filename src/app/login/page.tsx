import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE, AUTH_MAX_AGE, checkPassword, sessionToken } from '@/lib/auth';

export const metadata: Metadata = { title: 'Вход' };

// Only same-site paths, so ?next= can't send you to another domain.
const safeNext = (next: unknown) =>
  typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/';

async function login(formData: FormData) {
  'use server';
  const next = safeNext(formData.get('next'));
  if (!checkPassword(String(formData.get('password') ?? ''))) {
    await new Promise((r) => setTimeout(r, 1000)); // slows down guessing
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }
  (await cookies()).set(AUTH_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_MAX_AGE,
  });
  redirect(next);
}

export default async function LoginPage(props: PageProps<'/login'>) {
  const { next, error } = await props.searchParams;
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <form action={login} className="w-full max-w-sm rounded-xl border bg-fd-card p-6">
        <h1 className="text-2xl font-bold">🇷🇴 Limba Română</h1>
        <p className="mt-1 text-sm text-fd-muted-foreground">Введи пароль один раз. Браузер запомнит вход примерно на год.</p>
        {/* hidden username lets password managers (iCloud Keychain, Google) save and autofill with Face ID / fingerprint */}
        <input type="text" name="username" autoComplete="username" defaultValue="limba-romana" hidden readOnly />
        <input type="hidden" name="next" value={safeNext(next)} />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          required
          placeholder="Пароль"
          className="mt-4 w-full rounded-lg border bg-fd-background px-3 py-2 text-base"
        />
        {error && <p className="mt-2 text-sm text-red-500">Неверный пароль.</p>}
        <button type="submit" className="mt-4 w-full rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground">
          Войти
        </button>
      </form>
    </main>
  );
}
