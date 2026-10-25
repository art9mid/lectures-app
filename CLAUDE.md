@AGENTS.md

## Project overview

Romanian exam prep app (B1 / citizenship). Next.js 16 + Fumadocs (fumadocs-ui, fumadocs-mdx). See README.md for layout.

## Architecture

- **Content**: MDX in `content/docs/` (lectii, examen, vechi). Sidebar order via `meta.json`.
- **MDX components**: `src/components/mdx.tsx` registers `Ex`, `Formula`, `Conj`, `Compare`/`Side`, `Answer`, `Say` (browser TTS ro-RO), `Quiz`.
- **Quiz**: `src/lib/quiz/topics.ts` (registry + `buildTest`), banks in `src/lib/quiz/bank/`, generators `numbers.ts`, `verbs.ts`. Questions are plain JSON so wrong answers can be stored and replayed.
- **Results**: `src/lib/results.ts` → Supabase REST table `ro_attempts` (schema in `supabase/schema.sql`) when `NEXT_PUBLIC_SUPABASE_*` set, else localStorage.
- **Search**: Fumadocs Orama via `src/app/api/search/route.ts`.

## Content rules

- All Romanian text MUST use proper diacritics: ă, â, î, ș, ț (comma-below, never cedilla)
- Explanations in Russian, short and concrete. No em dashes in prose.
- Table headers use "Română" (not "Romana")
- Number words must match `toWords()`; run `node scripts/check-numbers.mts` after changing it.
