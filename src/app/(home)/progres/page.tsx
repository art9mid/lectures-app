import type { Metadata } from 'next';
import { ProgressPage } from '@/components/progress';

export const metadata: Metadata = { title: 'Прогресс' };

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Прогресс</h1>
      <ProgressPage />
    </main>
  );
}
