import type { Question, Topic } from './types';
import { numberQuestions } from './numbers';
import { verbQuestions } from './verbs';
import { questions as cifre } from './bank/cifre';
import { questions as aFi } from './bank/a-fi';
import { questions as vremea } from './bank/vremea';
import { questions as aAvea } from './bank/a-avea';
import { questions as verbeBaza } from './bank/verbe-baza';
import { questions as prezent } from './bank/prezent';
import { questions as timpuri } from './bank/timpuri';
import { questions as seara } from './bank/seara';
import { questions as viitor } from './bank/viitor';
import { questions as gen } from './bank/gen';
import { questions as civica } from './bank/civica';

const tag = (topic: string, qs: Question[]) => qs.map((q) => ({ ...q, topic }));

export const TOPICS: Topic[] = [
  { id: 'cifre', title: 'Cifrele (числа)', href: '/docs/lectii/00-cifrele', questions: () => [...tag('cifre', cifre), ...numberQuestions(15)] },
  { id: 'a-fi', title: 'Verbul „a fi”', href: '/docs/lectii/01-a-fi', questions: () => [...tag('a-fi', aFi), ...verbQuestions(['fi'], ['prezent'], 6, 'a-fi')] },
  { id: 'vremea', title: 'Vremea și zilele', href: '/docs/lectii/02-vremea-zilele', questions: () => tag('vremea', vremea) },
  { id: 'a-avea', title: 'Verbul „a avea”', href: '/docs/lectii/03-a-avea', questions: () => [...tag('a-avea', aAvea), ...verbQuestions(['avea'], ['prezent'], 6, 'a-avea')] },
  { id: 'verbe-baza', title: 'Verbele de bază', href: '/docs/lectii/04-verbe-de-baza', questions: () => [...tag('verbe-baza', verbeBaza), ...verbQuestions(['locui', 'munci', 'invata'], ['prezent'], 8, 'verbe-baza')] },
  { id: 'prezent', title: 'Prezentul (-a, -e, -ea, -i, -î)', href: '/docs/lectii/05-prezent', questions: () => [...tag('prezent', prezent), ...verbQuestions(['canta', 'merge', 'vedea', 'dormi', 'cobori'], ['prezent'], 10, 'prezent')] },
  { id: 'timpuri', title: 'Prezent, trecut, viitor', href: '/docs/lectii/06-conjugarea', questions: () => [...tag('timpuri', timpuri), ...verbQuestions(['lucra', 'desena', 'deschide', 'inchide', 'citi', 'hotari'], ['prezent', 'trecut', 'viitor'], 12, 'timpuri')] },
  { id: 'seara', title: 'Viața mea seara (text)', href: '/docs/lectii/07-viata-mea-seara', questions: () => tag('seara', seara) },
  { id: 'viitor', title: 'Timpul viitor', href: '/docs/lectii/08-viitorul', questions: () => [...tag('viitor', viitor), ...verbQuestions(['merge', 'veni', 'invata', 'lucra', 'avea', 'face', 'vorbi', 'manca', 'dormi'], ['viitor'], 10, 'viitor')] },
  { id: 'gen', title: 'Genul substantivelor', href: '/docs/vechi/lecture-5', questions: () => tag('gen', gen) },
  { id: 'civica', title: 'Cultură și Constituție', href: '/docs/examen/cultura-civica', questions: () => tag('civica', civica) },
];

export const topicById = (id: string) => TOPICS.find((t) => t.id === id);

export function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Random set for a test. Global mode draws evenly from every topic so no topic dominates.
export function buildTest(topicIds: string[] | 'all', count: number): Question[] {
  const topics = topicIds === 'all' ? TOPICS : TOPICS.filter((t) => topicIds.includes(t.id));
  const pools = topics.map((t) => shuffle(t.questions()));
  const out: Question[] = [];
  for (let i = 0; out.length < count && pools.some((p) => p.length); i++) {
    const p = pools[i % pools.length];
    const q = p.pop();
    if (q) out.push(q);
  }
  return shuffle(out).map((q) => (q.kind === 'choice' ? { ...q, options: shuffle(q.options) } : q));
}
