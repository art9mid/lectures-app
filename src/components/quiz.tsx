'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import type { Question } from '@/lib/quiz/types';
import { buildTest, shuffle } from '@/lib/quiz/topics';
import { saveAttempt } from '@/lib/results';
import { Say } from './learn';

const fixCedilla = (s: string) => s.replace(/ş/g, 'ș').replace(/Ş/g, 'Ș').replace(/ţ/g, 'ț').replace(/Ţ/g, 'Ț');
const norm = (s: string) =>
  fixCedilla(s).toLowerCase().replace(/[.,!?;:«»"„”]/g, '').replace(/\s+/g, ' ').trim();
const noDiacritics = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

type Verdict = 'ok' | 'diacritics' | 'wrong';

function judge(q: Question, given: string): Verdict {
  if (q.kind === 'choice') return given === q.answer ? 'ok' : 'wrong';
  const accepted = (Array.isArray(q.answer) ? q.answer : [q.answer]).map(norm);
  const g = norm(given);
  if (accepted.includes(g)) return 'ok';
  if (accepted.map(noDiacritics).includes(noDiacritics(g))) return 'diacritics';
  return 'wrong';
}

const mainAnswer = (q: Question) => (Array.isArray(q.answer) ? q.answer[0] : q.answer);

export function Quiz({
  topics = 'all',
  count = 10,
  questions: fixed,
  saveAs,
}: {
  topics?: string[] | 'all';
  count?: number;
  questions?: Question[]; // fixed list, e.g. replaying old mistakes
  saveAs?: string; // topic id stored with the result
}) {
  const make = () => (fixed ? shuffle(fixed).slice(0, count) : buildTest(topics, count));
  const [qs, setQs] = useState<Question[] | null>(null); // built on the client only, so SSR and random order never clash
  const [i, setI] = useState(0);
  const [given, setGiven] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [wrong, setWrong] = useState<Question[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- random questions must be created after hydration
  useEffect(() => setQs(make()), []);

  useEffect(() => {
    if (!verdict) inputRef.current?.focus({ preventScroll: true });
  }, [i, verdict]);

  if (!qs) return <div className="my-6 rounded-xl border p-6 text-fd-muted-foreground">Загружаю вопросы…</div>;
  if (qs.length === 0) return <div className="my-6 rounded-xl border p-6">Для этой темы пока нет вопросов.</div>;

  const done = i >= qs.length;
  const q = qs[i];
  const score = qs.length - wrong.length;

  function check(answer: string) {
    if (verdict || !answer.trim()) return;
    const v = judge(q, answer);
    setGiven(answer);
    setVerdict(v);
    if (v === 'wrong') setWrong((w) => [...w, q]);
  }

  function next() {
    const last = i + 1 >= qs!.length;
    if (last) {
      const finalWrong = wrong;
      saveAttempt({
        topic: saveAs ?? (topics === 'all' ? 'global' : topics.join('+')),
        score: qs!.length - finalWrong.length,
        total: qs!.length,
        wrong: finalWrong,
      }).catch((e) => setSaveError(String(e)));
    }
    setI(i + 1);
    setGiven('');
    setVerdict(null);
  }

  function restart() {
    setQs(make());
    setI(0);
    setWrong([]);
    setGiven('');
    setVerdict(null);
    setSaveError(null);
  }

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    return (
      <div className="not-prose my-6 rounded-xl border bg-fd-card p-6">
        <p className="text-sm text-fd-muted-foreground">Результат</p>
        <p className="mt-1 text-4xl font-bold tabular-nums">
          {score} / {qs.length} <span className="text-xl text-fd-muted-foreground">({pct}%)</span>
        </p>
        <p className="mt-2">
          {pct >= 75 ? 'Цель 75% достигнута. Закрепи тему общим тестом.' : 'Наша цель 75%. Разбери ошибки ниже и пройди тест ещё раз.'}
        </p>
        {saveError && <p className="mt-2 text-sm text-red-500">Не удалось сохранить результат: {saveError}</p>}
        {wrong.length > 0 && (
          <ul className="mt-4 space-y-2">
            {wrong.map((w, k) => (
              <li key={k} className="rounded-lg border p-3 text-sm">
                <div>{w.prompt}</div>
                <div className="mt-1 font-semibold text-green-600 dark:text-green-400">{mainAnswer(w)}</div>
                {w.explain && <div className="mt-1 text-fd-muted-foreground">{w.explain}</div>}
              </li>
            ))}
          </ul>
        )}
        <button onClick={restart} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground">
          <RotateCcw className="size-4" /> Новый случайный тест
        </button>
      </div>
    );
  }

  return (
    <div className="not-prose my-6 rounded-xl border bg-fd-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3 text-sm text-fd-muted-foreground">
        <span className="tabular-nums">
          {i + 1} / {qs.length}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-fd-muted">
          <div className="h-full bg-fd-primary transition-all" style={{ width: `${(i / qs.length) * 100}%` }} />
        </div>
      </div>

      <p className="text-lg font-medium">{q.prompt}</p>

      {q.kind === 'choice' ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {q.options.map((o) => {
            const picked = verdict && o === given;
            const right = verdict && o === q.answer;
            return (
              <button
                key={o}
                disabled={!!verdict}
                onClick={() => check(o)}
                className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                  right ? 'border-green-500 bg-green-500/10' : picked ? 'border-red-500 bg-red-500/10' : 'hover:bg-fd-accent'
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            check(given);
          }}
        >
          <input
            ref={inputRef}
            value={given}
            onChange={(e) => setGiven(e.target.value)}
            disabled={!!verdict}
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            placeholder="Ответ (ă â î ș ț)"
            className="min-w-0 flex-1 rounded-lg border bg-fd-background px-3 py-2 text-base"
          />
          <button type="submit" disabled={!!verdict} className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground disabled:opacity-50">
            Проверить
          </button>
        </form>
      )}
      {q.kind === 'input' && !verdict && <DiacriticKeys onKey={(c) => setGiven((g) => g + c)} />}

      {verdict && (
        <div
          className={`mt-4 rounded-lg p-3 ${verdict === 'wrong' ? 'bg-red-500/10' : verdict === 'diacritics' ? 'bg-amber-500/10' : 'bg-green-500/10'}`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {verdict === 'wrong' ? <X className="size-4 text-red-500" /> : <Check className="size-4 text-green-500" />}
            {verdict === 'ok' && 'Верно!'}
            {verdict === 'diacritics' && 'Засчитано, но проверь диакритику (ă, â, î, ș, ț):'}
            {verdict === 'wrong' && 'Правильно:'}
            {verdict !== 'ok' && <span>{mainAnswer(q)}</span>}
            <Say text={mainAnswer(q)} />
          </div>
          {q.explain && <p className="mt-1 text-sm text-fd-muted-foreground">{q.explain}</p>}
          <button autoFocus onClick={next} className="mt-3 rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground">
            {i + 1 >= qs.length ? 'Показать результат' : 'Дальше →'}
          </button>
        </div>
      )}
    </div>
  );
}

// Phones rarely have Romanian keyboard; these buttons type the letters.
function DiacriticKeys({ onKey }: { onKey: (c: string) => void }) {
  return (
    <div className="mt-2 flex gap-1.5">
      {['ă', 'â', 'î', 'ș', 'ț'].map((c) => (
        <button key={c} type="button" onClick={() => onKey(c)} className="size-9 rounded-md border text-base hover:bg-fd-accent">
          {c}
        </button>
      ))}
    </div>
  );
}
