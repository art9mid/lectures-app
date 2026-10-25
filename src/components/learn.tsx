'use client';

import type { ReactNode } from 'react';
import { Volume2 } from 'lucide-react';
import { conjugate, VERBS, type Tense } from '@/lib/quiz/verbs';

let cloudTts = true; // turns off after the first failure (no Azure key) so we don't retry every click
let current: HTMLAudioElement | null = null;

// Azure neural voice via /api/tts; falls back to the browser voice.
export function speak(text: string) {
  if (typeof window === 'undefined') return;
  if (cloudTts) {
    current?.pause();
    current = new Audio(`/api/tts?text=${encodeURIComponent(text)}`);
    current.play().catch(() => {
      cloudTts = false;
      speakBrowser(text);
    });
    return;
  }
  speakBrowser(text);
}

function speakBrowser(text: string) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ro-RO';
  u.rate = 0.85;
  // Prefer neural voices (Edge "Alina/Emil Online (Natural)"), then Apple "Ioana (Enhanced/Premium)", then any ro voice.
  const score = (v: SpeechSynthesisVoice) => (/natural|neural|online/i.test(v.name) ? 2 : /premium|enhanced/i.test(v.name) ? 1 : 0);
  const ro = speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('ro'))
    .sort((a, b) => score(b) - score(a))[0];
  if (ro) u.voice = ro;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

export function Say({ text, children }: { text?: string; children?: ReactNode }) {
  const t = text ?? (typeof children === 'string' ? children : '');
  return (
    <span className="inline-flex items-center gap-1">
      {children}
      <button
        type="button"
        onClick={() => speak(t)}
        aria-label={`Послушать: ${t}`}
        className="inline-flex size-6 items-center justify-center rounded-full text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
      >
        <Volume2 className="size-3.5" />
      </button>
    </span>
  );
}

// Highlights every occurrence of `hl` (comma-separated words) inside the Romanian sentence.
function highlight(text: string, hl?: string) {
  if (!hl) return text;
  const words = hl.split(',').map((w) => w.trim()).filter(Boolean);
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  return text.split(re).map((part, i) =>
    words.includes(part) ? (
      <mark key={i} className="rounded bg-fd-primary/15 px-1 font-semibold text-fd-primary">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/** Example sentence card: Romanian (with highlighted key word) + Russian + listen button. */
export function Ex({ ro, ru, hl, note }: { ro: string; ru: string; hl?: string; note?: string }) {
  return (
    <div className="not-prose my-2 flex items-start gap-3 rounded-lg border bg-fd-card px-4 py-3">
      <div className="flex-1">
        <div className="text-base font-medium">{highlight(ro, hl)}</div>
        <div className="text-sm text-fd-muted-foreground">{ru}</div>
        {note && <div className="mt-1 text-xs text-fd-muted-foreground italic">{note}</div>}
      </div>
      <Say text={ro} />
    </div>
  );
}

/** Sentence pattern as colored blocks: <Formula>Pronume + nu + verb</Formula> */
export function Formula({ children, hl }: { children: string; hl?: string }) {
  const keys = (hl ?? '').split(',').map((w) => w.trim());
  return (
    <div className="not-prose my-3 flex flex-wrap items-center gap-1.5">
      {children.split('+').map((part, i) => {
        const p = part.trim();
        return (
          <span key={i} className="contents">
            {i > 0 && <span className="text-fd-muted-foreground">+</span>}
            <span
              className={`rounded-md border px-2.5 py-1 text-sm font-medium ${
                keys.includes(p) ? 'border-fd-primary bg-fd-primary/10 text-fd-primary' : 'bg-fd-secondary'
              }`}
            >
              {p}
            </span>
          </span>
        );
      })}
    </div>
  );
}

const TONES = {
  blue: 'border-blue-500/40 bg-blue-500/5',
  amber: 'border-amber-500/40 bg-amber-500/5',
  green: 'border-green-500/40 bg-green-500/5',
  red: 'border-red-500/40 bg-red-500/5',
};

/** Two (or more) things side by side: <Compare><Side title="sunt">…</Side><Side title="este">…</Side></Compare> */
export function Compare({ children }: { children: ReactNode }) {
  return <div className="my-4 grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function Side({ title, tone = 'blue', children }: { title: string; tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <div className={`rounded-xl border p-4 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 ${TONES[tone]}`}>
      <div className="mb-2 text-lg font-bold">{title}</div>
      {children}
    </div>
  );
}

/** Hidden answer for exercises. */
export function Answer({ children }: { children: ReactNode }) {
  return (
    <details className="my-2 rounded-lg border px-3 py-2 [&[open]>summary]:mb-2">
      <summary className="cursor-pointer text-sm font-medium text-fd-primary select-none">Показать ответ</summary>
      {children}
    </details>
  );
}

const ROWS: [number, string, number, string][] = [
  [0, 'eu', 3, 'noi'],
  [1, 'tu', 4, 'voi'],
  [2, 'el / ea', 5, 'ei / ele'],
];

/** Conjugation as a 3×2 grid: singular left, plural right. <Conj verb="fi" tense="prezent" /> */
export function Conj({ verb, tense = 'prezent' }: { verb: string; tense?: Tense }) {
  const v = VERBS[verb];
  if (!v) return null;
  const forms = conjugate(verb, tense);
  return (
    <div className="not-prose my-4 overflow-hidden rounded-xl border">
      <div className="flex items-baseline justify-between bg-fd-secondary px-4 py-2">
        <span className="font-bold">{v.inf}</span>
        <span className="text-sm text-fd-muted-foreground">
          {v.ru} · {tense}
        </span>
      </div>
      <div className="grid grid-cols-2 text-sm">
        <div className="border-b px-4 py-1.5 text-xs text-fd-muted-foreground">единственное число</div>
        <div className="border-b border-l px-4 py-1.5 text-xs text-fd-muted-foreground">множественное число</div>
        {ROWS.map(([a, pa, b, pb]) => (
          <div key={pa} className="contents">
            <Cell person={pa} form={forms[a]} />
            <Cell person={pb} form={forms[b]} left />
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({ person, form, left }: { person: string; form: string; left?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-2 px-4 py-2.5 ${left ? 'border-l' : ''}`}>
      <span>
        <span className="text-fd-muted-foreground">{person} </span>
        <span className="font-semibold text-fd-primary">{form}</span>
      </span>
      <Say text={`${person.split(' / ')[0]} ${form}`} />
    </div>
  );
}
