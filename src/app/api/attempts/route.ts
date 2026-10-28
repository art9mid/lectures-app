import type { NextRequest } from 'next/server';
import { AUTH_COOKIE, isAuthed } from '@/lib/auth';

// Server-side proxy to Supabase, so the key never reaches the browser.
const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;
const headers = { apikey: KEY ?? '', Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

function guard(req: NextRequest) {
  if (!isAuthed(req.cookies.get(AUTH_COOKIE)?.value)) return new Response('Unauthorized', { status: 401 });
  if (!URL || !KEY) return new Response('Supabase not configured', { status: 501 });
  return null;
}

export async function GET(req: NextRequest) {
  const denied = guard(req);
  if (denied) return denied;
  const res = await fetch(`${URL}/rest/v1/ro_attempts?select=*&order=created_at.desc&limit=500`, { headers, cache: 'no-store' });
  return new Response(res.body, { status: res.status, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req: NextRequest) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.text();
  if (body.length > 200_000) return new Response('Too large', { status: 413 });
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }
  const { topic, score, total, wrong } = data;
  if (typeof topic !== 'string' || !Number.isInteger(score) || !Number.isInteger(total) || !Array.isArray(wrong)) {
    return new Response('Bad attempt', { status: 400 });
  }
  const res = await fetch(`${URL}/rest/v1/ro_attempts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topic: topic.slice(0, 50), score, total, wrong }),
  });
  return new Response(res.ok ? null : await res.text(), { status: res.ok ? 201 : res.status });
}
