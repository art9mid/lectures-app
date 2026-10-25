import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Quiz } from '@/components/quiz';
import { TOPICS, topicById } from '@/lib/quiz/topics';

export function generateStaticParams() {
  return [{ topic: 'global' }, ...TOPICS.map((t) => ({ topic: t.id }))];
}

export async function generateMetadata(props: PageProps<'/teste/[topic]'>): Promise<Metadata> {
  const { topic } = await props.params;
  return { title: topic === 'global' ? 'Общий тест' : (topicById(topic)?.title ?? 'Тест') };
}

export default async function TopicTestPage(props: PageProps<'/teste/[topic]'>) {
  const { topic } = await props.params;
  const global = topic === 'global';
  const t = topicById(topic);
  if (!global && !t) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <Link href="/teste" className="text-sm text-fd-muted-foreground hover:underline">
        ← Все тесты
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{global ? 'Общий тест' : t!.title}</h1>
      {t && (
        <Link href={t.href} className="text-sm text-fd-primary hover:underline">
          Повторить теорию →
        </Link>
      )}
      <Quiz key={topic} topics={global ? 'all' : [topic]} count={global ? 20 : 12} />
    </main>
  );
}
