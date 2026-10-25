'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Question } from '@/lib/quiz/types';
import { TOPICS, topicById } from '@/lib/quiz/topics';
import { type Attempt, cloudEnabled, loadAttempts } from '@/lib/results';
import { Quiz } from './quiz';

function useAttempts() {
  const [data, setData] = useState<Attempt[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadAttempts().then(setData, (e) => setError(String(e)));
  }, []);
  return { data, error };
}

const pct = (a: Attempt) => Math.round((a.score / a.total) * 100);
const topicTitle = (id: string) =>
  id === 'global' ? 'Общий тест' : id === 'greseli' ? 'Работа над ошибками' : (topicById(id)?.title ?? id);

function dayKey(iso?: string) {
  return iso ? new Date(iso).toLocaleDateString('sv-SE') : '';
}

// Consecutive days (ending today or yesterday) with at least one test.
function streak(attempts: Attempt[]) {
  const days = new Set(attempts.map((a) => dayKey(a.created_at)));
  const d = new Date();
  if (!days.has(dayKey(d.toISOString()))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(dayKey(d.toISOString()))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

function topicStats(attempts: Attempt[]) {
  return TOPICS.map((t) => {
    const mine = attempts.filter((a) => a.topic === t.id);
    const last3 = mine.slice(0, 3);
    const avg = last3.length ? Math.round(last3.reduce((s, a) => s + pct(a), 0) / last3.length) : null;
    return { topic: t, count: mine.length, avg };
  });
}

// Recent wrong answers, newest first, without duplicates.
function mistakes(attempts: Attempt[], limit = 40): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  for (const a of attempts) {
    for (const q of a.wrong ?? []) {
      if (seen.has(q.prompt)) continue;
      seen.add(q.prompt);
      out.push(q);
    }
  }
  return out.slice(0, limit);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-fd-card p-4">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-sm text-fd-muted-foreground">{label}</div>
    </div>
  );
}

export function ProgressSummary() {
  const { data } = useAttempts();
  if (!data) return <div className="h-[88px]" />;
  if (data.length === 0)
    return (
      <p className="rounded-xl border bg-fd-card p-4 text-fd-muted-foreground">
        Пока нет результатов. Пройди первый тест, и здесь появится статистика.
      </p>
    );
  const last10 = data.slice(0, 10);
  const avg = Math.round(last10.reduce((s, a) => s + pct(a), 0) / last10.length);
  const weak = topicStats(data)
    .filter((s) => s.avg !== null)
    .sort((a, b) => a.avg! - b.avg!)[0];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="тестов пройдено" value={String(data.length)} />
      <Stat label="средний балл (10 последних)" value={`${avg}%`} />
      <Stat label="дней подряд" value={String(streak(data))} />
      <Link href={weak ? `/teste/${weak.topic.id}` : '/teste'} className="rounded-xl border bg-fd-card p-4 hover:bg-fd-accent">
        <div className="truncate font-bold">{weak?.topic.title ?? '—'}</div>
        <div className="text-sm text-fd-muted-foreground">слабая тема · повторить →</div>
      </Link>
    </div>
  );
}

export function ProgressPage() {
  const { data, error } = useAttempts();
  const [review, setReview] = useState(false);

  if (error) return <p className="text-red-500">Не удалось загрузить результаты: {error}</p>;
  if (!data) return <p className="text-fd-muted-foreground">Загружаю…</p>;

  const stats = topicStats(data);
  const wrong = mistakes(data);

  return (
    <div className="space-y-10">
      <ProgressSummary />
      {!cloudEnabled && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
          Результаты сохраняются только в этом браузере. Чтобы видеть их и на телефоне, и на компьютере, подключи Supabase
          (инструкция в README).
        </p>
      )}

      <section>
        <h2 className="mb-3 text-xl font-semibold">По темам</h2>
        <p className="mb-3 text-sm text-fd-muted-foreground">Средний результат трёх последних попыток. Цель: 75% и выше.</p>
        <div className="space-y-2">
          {stats.map(({ topic, count, avg }) => (
            <Link key={topic.id} href={`/teste/${topic.id}`} className="block rounded-lg border p-3 hover:bg-fd-accent">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium">{topic.title}</span>
                <span className="tabular-nums text-fd-muted-foreground">
                  {avg === null ? 'не начато' : `${avg}% · ${count} ${count === 1 ? 'попытка' : 'попыток'}`}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-fd-muted">
                <div
                  className={`h-full ${avg === null ? '' : avg >= 75 ? 'bg-green-500' : avg >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${avg ?? 0}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Работа над ошибками</h2>
        {wrong.length === 0 ? (
          <p className="text-fd-muted-foreground">Ошибок пока нет.</p>
        ) : review ? (
          <Quiz questions={wrong} count={15} saveAs="greseli" />
        ) : (
          <button onClick={() => setReview(true)} className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground">
            Повторить {Math.min(15, wrong.length)} из {wrong.length} последних ошибок
          </button>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">История</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <tbody>
              {data.slice(0, 50).map((a, k) => (
                <tr key={a.id ?? k} className="border-b last:border-0">
                  <td className="px-3 py-2 whitespace-nowrap text-fd-muted-foreground">
                    {a.created_at ? new Date(a.created_at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                  </td>
                  <td className="px-3 py-2">{topicTitle(a.topic)}</td>
                  <td className={`px-3 py-2 text-right font-semibold tabular-nums ${pct(a) >= 75 ? 'text-green-600 dark:text-green-400' : ''}`}>
                    {a.score}/{a.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
