import type { Question } from './quiz/types';

export type Attempt = {
  id?: number;
  created_at?: string;
  topic: string; // topic id, "global" or "greseli"
  score: number;
  total: number;
  wrong: Question[];
};

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const LOCAL = 'ro-attempts';

export const cloudEnabled = Boolean(URL && KEY);

const headers = { apikey: KEY ?? '', Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

function readLocal(): Attempt[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL) ?? '[]');
  } catch {
    return [];
  }
}

// Single user, no auth: Supabase when env vars are set (phone + PC share data), otherwise this browser only.
export async function saveAttempt(a: Attempt): Promise<void> {
  if (cloudEnabled) {
    const res = await fetch(`${URL}/rest/v1/ro_attempts`, { method: 'POST', headers, body: JSON.stringify(a) });
    if (!res.ok) throw new Error(`Supabase: ${res.status} ${await res.text()}`);
    return;
  }
  try {
    localStorage.setItem(LOCAL, JSON.stringify([{ ...a, created_at: new Date().toISOString() }, ...readLocal()].slice(0, 500)));
  } catch {
    // storage blocked (private mode): result is lost, nothing else to do
  }
}

export async function loadAttempts(): Promise<Attempt[]> {
  if (cloudEnabled) {
    const res = await fetch(`${URL}/rest/v1/ro_attempts?select=*&order=created_at.desc&limit=500`, { headers });
    if (!res.ok) throw new Error(`Supabase: ${res.status} ${await res.text()}`);
    return res.json();
  }
  return readLocal();
}
