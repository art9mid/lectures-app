import type { Question } from './types';

const ONES = ['zero', 'unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă'];
const TEENS = [
  'zece', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece',
  'cincisprezece', 'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece',
];
const TENS = ['', '', 'douăzeci', 'treizeci', 'patruzeci', 'cincizeci', 'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci'];

// 0..99. `fem` = feminine form used before "mii"/"sute": două, douăsprezece, douăzeci și două.
function below100(n: number, fem = false): string {
  const two = fem ? 'două' : 'doi';
  if (n < 10) return n === 2 ? two : n === 1 && fem ? 'una' : ONES[n];
  if (n < 20) return n === 12 && fem ? 'douăsprezece' : TEENS[n - 10];
  const t = TENS[Math.floor(n / 10)];
  const u = n % 10;
  return u === 0 ? t : `${t} și ${u === 2 ? two : u === 1 && fem ? 'una' : ONES[u]}`;
}

// "de" goes before the noun when the last two digits are 00 or 20..99 (douăzeci de mii, o sută de mii).
const needsDe = (n: number) => n % 100 === 0 || n % 100 >= 20;

function below1000(n: number, fem = false): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (h === 1) parts.push('o sută');
  else if (h > 1) parts.push(`${below100(h, true)} sute`);
  if (rest) parts.push(below100(rest, fem));
  return parts.join(' ');
}

function group(n: number, one: string, many: string): string {
  if (n === 1) return one;
  return `${below1000(n, true)} ${needsDe(n) ? 'de ' : ''}${many}`;
}

// ponytail: up to 999.999.999, enough for the exam; thousands/millions ending in 1 above 20
// ("douăzeci și una de mii") have two accepted forms, so the generator skips them.
export function toWords(n: number): string {
  if (n === 0) return 'zero';
  const m = Math.floor(n / 1_000_000);
  const k = Math.floor((n % 1_000_000) / 1000);
  const r = n % 1000;
  const parts: string[] = [];
  if (m) parts.push(group(m, 'un milion', 'milioane'));
  if (k) parts.push(group(k, 'o mie', 'mii'));
  if (r) parts.push(below1000(r));
  return parts.join(' ');
}

export const formatNum = (n: number) => n.toLocaleString('de-DE'); // 1.250.000, like in the lesson

const rnd = (max: number) => Math.floor(Math.random() * max);
const pick = <T,>(xs: T[]) => xs[rnd(xs.length)];

function randomNumber(): number {
  const ranges: (() => number)[] = [
    () => 1 + rnd(19),
    () => 20 + rnd(80),
    () => 100 + rnd(900),
    () => 1000 + rnd(9000),
    () => pick([2, 3, 5, 10, 12, 20, 25, 50, 83, 100, 200, 500]) * 1000,
    () => pick([1, 2, 3, 5, 7]) * 1_000_000 + pick([0, 250, 340, 500]) * 1000,
  ];
  for (;;) {
    const n = pick(ranges)();
    const k = Math.floor((n % 1_000_000) / 1000);
    if (!(k > 20 && k % 10 === 1)) return n;
  }
}

export function numberQuestions(count = 12): Question[] {
  return Array.from({ length: count }, () => {
    const n = randomNumber();
    const words = toWords(n);
    if (Math.random() < 0.5) {
      return {
        kind: 'input',
        prompt: `Напиши словами: ${formatNum(n)}`,
        answer: words,
        explain: words,
        topic: 'cifre',
      } satisfies Question;
    }
    const wrong = new Set<string>();
    while (wrong.size < 3) {
      const d = n + pick([-10, -2, -1, 1, 2, 10, 100, -100, 1000]);
      if (d > 0 && d !== n) wrong.add(formatNum(d));
    }
    return {
      kind: 'choice',
      prompt: `Какое это число: «${words}»?`,
      options: [formatNum(n), ...wrong],
      answer: formatNum(n),
      topic: 'cifre',
    } satisfies Question;
  });
}
