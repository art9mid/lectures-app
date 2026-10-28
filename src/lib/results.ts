import type { Question } from './quiz/types';

export type Attempt = {
  id?: number;
  created_at?: string;
  topic: string; // topic id, "global" or "greseli"
  score: number;
  total: number;
  wrong: Question[];
};

const LOCAL = 'ro-attempts';

// True until /api/attempts answers 501 (Supabase not configured); then this browser's localStorage is used.
export let cloudEnabled = true;

function readLocal(): Attempt[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL) ?? '[]');
  } catch {
    return [];
  }
}

function saveLocal(a: Attempt) {
  try {
    localStorage.setItem(LOCAL, JSON.stringify([{ ...a, created_at: new Date().toISOString() }, ...readLocal()].slice(0, 500)));
  } catch {
    // storage blocked (private mode): result is lost, nothing else to do
  }
}

export async function saveAttempt(a: Attempt): Promise<void> {
  if (cloudEnabled) {
    const res = await fetch('/api/attempts', { method: 'POST', body: JSON.stringify(a) });
    if (res.status !== 501) {
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      return;
    }
    cloudEnabled = false;
  }
  saveLocal(a);
}

export async function loadAttempts(): Promise<Attempt[]> {
  if (cloudEnabled) {
    const res = await fetch('/api/attempts', { cache: 'no-store' });
    if (res.status !== 501) {
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      return res.json();
    }
    cloudEnabled = false;
  }
  return readLocal();
}
