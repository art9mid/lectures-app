import Link from 'next/link';
import { BookOpen, ChartLine, GraduationCap, Shuffle } from 'lucide-react';
import { ProgressSummary } from '@/components/progress';

const CARDS = [
  { href: '/docs', icon: BookOpen, title: 'Уроки', text: 'Выжимка, теория, примеры с озвучкой и тест в конце каждого урока.' },
  { href: '/teste/global', icon: Shuffle, title: 'Общий тест', text: '20 случайных вопросов по всем темам. Каждый раз новый набор.' },
  { href: '/teste', icon: GraduationCap, title: 'Тесты по темам', text: 'Выбери тему и тренируй её, пока не наберёшь 75%.' },
  { href: '/progres', icon: ChartLine, title: 'Прогресс', text: 'Результаты по темам, история и повтор своих ошибок.' },
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-16">
      <p className="text-sm font-medium text-fd-primary">Экзамен на гражданство · уровень B1</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Limba Română</h1>
      <p className="mt-3 max-w-2xl text-lg text-fd-muted-foreground">
        Учи тему, проверяй себя случайным тестом, смотри, где ошибаешься. Результаты синхронизируются между телефоном и компьютером.
      </p>

      <div className="mt-8">
        <ProgressSummary />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {CARDS.map(({ href, icon: Icon, title, text }) => (
          <Link key={href} href={href} className="group rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent">
            <Icon className="size-5 text-fd-primary" />
            <div className="mt-3 font-semibold">{title}</div>
            <div className="mt-1 text-sm text-fd-muted-foreground">{text}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-fd-card p-5">
        <div className="font-semibold">С чего начать</div>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-fd-muted-foreground">
          <li>
            Прочитай <Link className="text-fd-primary underline" href="/docs/examen/despre-examen">что проверяют на экзамене</Link> и{' '}
            <Link className="text-fd-primary underline" href="/docs/examen/cum-sa-inveti">как учить</Link>.
          </li>
          <li>Проходи уроки по порядку. После каждого сделай тест по теме.</li>
          <li>Раз в день проходи общий тест и раз в несколько дней повторяй ошибки на странице «Прогресс».</li>
        </ol>
      </div>
    </main>
  );
}
