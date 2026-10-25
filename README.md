# Limba Română

Подготовка к экзамену по румынскому (B1, гражданство). Next.js 16 + [Fumadocs](https://fumadocs.dev).

- `content/docs/lectii/*.mdx` уроки (выжимка, теория, примеры с озвучкой, упражнения, тест)
- `content/docs/examen/*.mdx` про экзамен, как учить, культура и Конституция, устная часть
- `content/docs/vechi/*.mdx` старый курс
- `src/lib/quiz/` банк вопросов, генераторы (числа, спряжения), сборка случайного теста
- `/teste`, `/teste/[topic]`, `/progres` тесты и статистика

## Запуск

```bash
npm install
npm run dev
node scripts/check-numbers.mts   # проверка генератора чисел
```

## Результаты на телефоне и ПК (Supabase)

1. Сейчас используется таблица `ro_attempts` в проекте Supabase `ib-exam-notes`. Для нового проекта: создай его на supabase.com.
2. SQL Editor → выполни `supabase/schema.sql`.
3. Project Settings → API → скопируй URL и anon key в `.env.local` (см. `.env.example`) и в Vercel → Settings → Environment Variables.

Без этих переменных результаты хранятся только в браузере.

Безопасности нет специально: любой, кто знает URL сайта, может читать и добавлять результаты. Для одного пользователя это нормально.

## Добавить урок

1. Создай `content/docs/lectii/09-....mdx` (формат как в `01-a-fi.mdx`) и добавь в `content/docs/lectii/meta.json`.
2. Вопросы: `src/lib/quiz/bank/<id>.ts`, затем строка в `TOPICS` в `src/lib/quiz/topics.ts`.
3. В MDX: `<Quiz topics={['<id>']} count={10} />`.

Компоненты для MDX: `Ex`, `Formula`, `Conj`, `Compare`/`Side`, `Answer`, `Say`, `Quiz` (`src/components/learn.tsx`, `quiz.tsx`) плюс встроенные Fumadocs (`Callout`, `Tabs`, `Steps`, `Accordion`, `Cards`).

## Голос (Azure Neural TTS)

Кнопки 🔊 берут голос `ro-RO-AlinaNeural` через `/api/tts` (MP3 кэшируется CDN). Без ключа используется голос браузера.

1. portal.azure.com → Create resource → **Speech** → тариф Free F0, регион West Europe.
2. Keys and Endpoint → KEY 1 → `AZURE_SPEECH_KEY` в `.env.local` и в Vercel. Регион → `AZURE_SPEECH_REGION`.
