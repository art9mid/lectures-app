import type { Question } from '../types';

export const questions: Question[] = [
  { kind: 'choice', prompt: 'Как спросить «Который час?»', options: ['Cât este ceasul?', 'Ce dată este?', 'Când este?'], answer: 'Cât este ceasul?' },
  { kind: 'choice', prompt: 'Как спросить «Какое сегодня число?»', options: ['Ce dată este azi?', 'Cât este ceasul?', 'Ce zi este mâine?'], answer: 'Ce dată este azi?' },
  { kind: 'choice', prompt: 'Как спросить «Во сколько?»', options: ['La ce oră?', 'Cât este ora?', 'Când oră?'], answer: 'La ce oră?' },
  { kind: 'choice', prompt: '2:00 по-румынски:', options: ['ora două', 'ora doi', 'ora a doua'], answer: 'ora două', explain: 'ora женского рода → două' },
  { kind: 'choice', prompt: '12:00 по-румынски:', options: ['ora douăsprezece', 'ora doisprezece', 'ora douăzeci'], answer: 'ora douăsprezece', explain: 'ora женского рода → douăsprezece' },
  { kind: 'choice', prompt: '«половина четвёртого» (3:30):', options: ['ora trei și jumătate', 'ora patru și jumătate', 'ora patru fără jumătate'], answer: 'ora trei și jumătate', explain: 'румыны считают от прошедшего часа: три с половиной' },
  { kind: 'choice', prompt: '«без четверти пять» (4:45):', options: ['ora cinci fără un sfert', 'ora patru fără un sfert', 'ora cinci și un sfert'], answer: 'ora cinci fără un sfert' },
  { kind: 'choice', prompt: '«и четверть» по-румынски:', options: ['și un sfert', 'și jumătate', 'fără un sfert'], answer: 'și un sfert' },
  { kind: 'choice', prompt: '«в восемь часов»:', options: ['la ora opt', 'în ora opt', 'pe ora opt'], answer: 'la ora opt', explain: 'время: la ora …' },
  { kind: 'choice', prompt: '«5 мая» (когда?):', options: ['pe 5 mai', 'la 5 mai', 'în 5 mai'], answer: 'pe 5 mai', explain: 'дата с числом: pe' },
  { kind: 'choice', prompt: '«в мае» (без числа):', options: ['în mai', 'pe mai', 'la mai'], answer: 'în mai', explain: 'месяц без числа: în' },
  { kind: 'choice', prompt: '«в 2026 году»:', options: ['în 2026', 'pe 2026', 'la 2026'], answer: 'în 2026' },
  { kind: 'choice', prompt: '1 decembrie читается:', options: ['întâi decembrie', 'una decembrie', 'prima decembrie'], answer: 'întâi decembrie', explain: 'первое число месяца: întâi' },
  { kind: 'choice', prompt: 'Национальный день Румынии:', options: ['1 decembrie', '24 ianuarie', '1 mai'], answer: '1 decembrie' },
  { kind: 'choice', prompt: '24 ianuarie это:', options: ['Unirea Principatelor (1859)', 'Ziua Națională', 'Ziua Constituției'], answer: 'Unirea Principatelor (1859)' },
  { kind: 'choice', prompt: 'iunie это:', options: ['июнь', 'июль', 'январь'], answer: 'июнь', explain: 'iunie (n) = июнь, iulie (l) = июль' },
  { kind: 'choice', prompt: 'iulie это:', options: ['июль', 'июнь', 'апрель'], answer: 'июль' },
  { kind: 'choice', prompt: 'Как пишутся месяцы?', options: ['с маленькой буквы', 'с большой буквы', 'как угодно'], answer: 'с маленькой буквы' },
  { kind: 'choice', prompt: '«утром» по-румынски:', options: ['dimineața', 'seara', 'noaptea'], answer: 'dimineața' },
  { kind: 'choice', prompt: '«вечером» по-румынски:', options: ['seara', 'la prânz', 'dimineața'], answer: 'seara' },
  { kind: 'choice', prompt: '«в обед» по-румынски:', options: ['la prânz', 'noaptea', 'după-amiaza'], answer: 'la prânz' },
  { kind: 'input', prompt: 'Переведи: Который час?', answer: ['Cât este ceasul', 'Cât e ceasul', 'Ce oră este', 'Ce oră e'] },
  { kind: 'input', prompt: 'Переведи: Сейчас три часа.', answer: ['Este ora trei', 'E ora trei'] },
  { kind: 'input', prompt: 'Переведи: Я просыпаюсь в семь.', answer: ['Mă trezesc la ora șapte', 'Eu mă trezesc la ora șapte', 'Mă trezesc la șapte'] },
  { kind: 'input', prompt: 'Переведи: Когда у тебя день рождения?', answer: ['Când e ziua ta', 'Când este ziua ta'] },
  { kind: 'input', prompt: 'Переведи: Экзамен в марте.', answer: ['Examenul este în martie', 'Examenul e în martie'] },
  { kind: 'input', prompt: 'Переведи: ночью', answer: 'noaptea' },
  { kind: 'input', prompt: 'Переведи: половина (в часах)', answer: 'jumătate' },
  { kind: 'input', prompt: 'Переведи: четверть (в часах)', answer: ['un sfert', 'sfert'] },
];

const HOURS = ['', 'unu', 'două', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă', 'zece', 'unsprezece', 'douăsprezece'];
// minute → [words after "și" (or null), words after "fără" (or null)]
const MINUTES: Record<number, [string | null, string | null]> = {
  0: [null, null],
  5: ['cinci', null],
  10: ['zece', null],
  15: ['un sfert', null],
  20: ['douăzeci', null],
  30: ['jumătate', null],
  40: ['patruzeci', 'douăzeci'],
  45: ['patruzeci și cinci', 'un sfert'],
  50: ['cincizeci', 'zece'],
  55: ['cincizeci și cinci', 'cinci'],
};
// [română, русский, русский родительный падеж для дат]
const MONTHS: [string, string, string][] = [
  ['ianuarie', 'январь', 'января'], ['februarie', 'февраль', 'февраля'], ['martie', 'март', 'марта'],
  ['aprilie', 'апрель', 'апреля'], ['mai', 'май', 'мая'], ['iunie', 'июнь', 'июня'],
  ['iulie', 'июль', 'июля'], ['august', 'август', 'августа'], ['septembrie', 'сентябрь', 'сентября'],
  ['octombrie', 'октябрь', 'октября'], ['noiembrie', 'ноябрь', 'ноября'], ['decembrie', 'декабрь', 'декабря'],
];

const rnd = (n: number) => Math.floor(Math.random() * n);

// All accepted spellings for h:m (with and without "ora"); first one is the main answer.
export function timeWords(h: number, m: number): string[] {
  const [si, fara] = MINUTES[m];
  const next = h === 12 ? 1 : h + 1;
  const forms = m === 0 ? [HOURS[h], `${HOURS[h]} fix`] : [];
  if (fara) forms.push(`${HOURS[next]} fără ${fara}`);
  if (si) forms.push(`${HOURS[h]} și ${si}`);
  if (m === 15) forms.push(`${HOURS[h]} și cincisprezece`);
  if (m === 30) forms.push(`${HOURS[h]} și treizeci`);
  return [...forms.map((f) => `ora ${f}`), ...forms];
}

function timeQuestion(): Question {
  const h = 1 + rnd(12);
  const mins = Object.keys(MINUTES).map(Number);
  const m = mins[rnd(mins.length)];
  const label = `${h}:${String(m).padStart(2, '0')}`;
  const words = timeWords(h, m);
  if (Math.random() < 0.5) {
    return { kind: 'input', prompt: `Сколько времени: ${label}? (словами)`, answer: words, explain: words[0], topic: 'ora-data' };
  }
  // Distractors: neighbouring times, so the choice tests și / fără and the hour shift.
  const wrong = new Set<string>();
  for (const [dh, dm] of [[1, 0], [-1, 0], [0, 15], [0, -15], [0, 5], [0, -5], [1, 30]]) {
    const nh = ((h + dh + 11) % 12) + 1;
    const nm = m + dm;
    if (nm in MINUTES && !(nh === h && nm === m)) wrong.add(timeWords(nh, nm)[0]);
  }
  const options = [words[0], ...[...wrong].slice(0, 3)];
  return { kind: 'choice', prompt: `Сколько времени: ${label}?`, options, answer: words[0], topic: 'ora-data' };
}

function monthQuestion(): Question {
  const i = rnd(12);
  const [ro, ru, ruGen] = MONTHS[i];
  if (Math.random() < 0.5) {
    return { kind: 'input', prompt: `Напиши месяц по-румынски: ${ru}`, answer: ro, topic: 'ora-data' };
  }
  const day = 2 + rnd(27);
  const others = new Set<string>();
  while (others.size < 3) {
    const j = rnd(12);
    if (j !== i) others.add(`${day} ${MONTHS[j][0]}`);
  }
  return {
    kind: 'choice',
    prompt: `Как по-румынски: ${day} ${ruGen}?`,
    options: [`${day} ${ro}`, ...others],
    answer: `${day} ${ro}`,
    topic: 'ora-data',
  };
}

// Fresh random clock/date questions on every call.
export function generate(): Question[] {
  return [...Array.from({ length: 8 }, timeQuestion), ...Array.from({ length: 4 }, monthQuestion)];
}
