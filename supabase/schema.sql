-- Run once in Supabase → SQL Editor. One table, one user, no auth.
create table if not exists ro_attempts (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  topic text not null,
  score int not null,
  total int not null,
  wrong jsonb not null default '[]'
);

alter table ro_attempts enable row level security;

-- Anyone with the anon key may read and add results (no update/delete from the browser).
create policy "anon read" on ro_attempts for select to anon using (true);
create policy "anon insert" on ro_attempts for insert to anon with check (true);
