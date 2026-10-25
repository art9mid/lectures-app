import Link from 'next/link';
import type { Metadata } from 'next';
import { TOPICS } from '@/lib/quiz/topics';

export const metadata: Metadata = { title: 'Тесты' };

export default function TestsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Тесты</h1>
      <p className="mt-2 text-fd-muted-foreground">
        Вопросы выбираются случайно при каждом запуске. Результат сохраняется в «Прогресс».
      </p>

      <Link href="/teste/global" className="mt-6 block rounded-xl border-2 border-fd-primary bg-fd-primary/5 p-5 hover:bg-fd-primary/10">
        <div className="text-lg font-semibold">Общий тест · 20 вопросов</div>
        <div className="text-sm text-fd-muted-foreground">Поровну из всех тем. Похоже на грамматическую часть экзамена.</div>
      </Link>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {TOPICS.map((t) => (
          <Link key={t.id} href={`/teste/${t.id}`} className="rounded-lg border p-4 hover:bg-fd-accent">
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-fd-muted-foreground">{t.questions().length} вопросов в банке</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
