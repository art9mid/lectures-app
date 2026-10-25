import type { Question } from './types';

export const PERSONS = ['Eu', 'Tu', 'El', 'Noi', 'Voi', 'Ei'] as const;
const AUX_PAST = ['am', 'ai', 'a', 'am', 'ați', 'au'];
const AUX_FUT = ['voi', 'vei', 'va', 'vom', 'veți', 'vor'];

type Verb = { inf: string; ru: string; prezent: string[]; part: string };

// prezent: eu, tu, el/ea, noi, voi, ei/ele. part = participle for the past tense (am mers).
export const VERBS: Record<string, Verb> = {
  fi: { inf: 'a fi', ru: 'быть', prezent: ['sunt', 'ești', 'este', 'suntem', 'sunteți', 'sunt'], part: 'fost' },
  avea: { inf: 'a avea', ru: 'иметь', prezent: ['am', 'ai', 'are', 'avem', 'aveți', 'au'], part: 'avut' },
  locui: { inf: 'a locui', ru: 'жить', prezent: ['locuiesc', 'locuiești', 'locuiește', 'locuim', 'locuiți', 'locuiesc'], part: 'locuit' },
  munci: { inf: 'a munci', ru: 'работать', prezent: ['muncesc', 'muncești', 'muncește', 'muncim', 'munciți', 'muncesc'], part: 'muncit' },
  invata: { inf: 'a învăța', ru: 'учить', prezent: ['învăț', 'înveți', 'învață', 'învățăm', 'învățați', 'învață'], part: 'învățat' },
  canta: { inf: 'a cânta', ru: 'петь', prezent: ['cânt', 'cânți', 'cântă', 'cântăm', 'cântați', 'cântă'], part: 'cântat' },
  merge: { inf: 'a merge', ru: 'идти', prezent: ['merg', 'mergi', 'merge', 'mergem', 'mergeți', 'merg'], part: 'mers' },
  vedea: { inf: 'a vedea', ru: 'видеть', prezent: ['văd', 'vezi', 'vede', 'vedem', 'vedeți', 'văd'], part: 'văzut' },
  dormi: { inf: 'a dormi', ru: 'спать', prezent: ['dorm', 'dormi', 'doarme', 'dormim', 'dormiți', 'dorm'], part: 'dormit' },
  cobori: { inf: 'a coborî', ru: 'спускаться', prezent: ['cobor', 'cobori', 'coboară', 'coborâm', 'coborâți', 'coboară'], part: 'coborât' },
  lucra: { inf: 'a lucra', ru: 'работать', prezent: ['lucrez', 'lucrezi', 'lucrează', 'lucrăm', 'lucrați', 'lucrează'], part: 'lucrat' },
  desena: { inf: 'a desena', ru: 'рисовать', prezent: ['desenez', 'desenezi', 'desenează', 'desenăm', 'desenați', 'desenează'], part: 'desenat' },
  deschide: { inf: 'a deschide', ru: 'открывать', prezent: ['deschid', 'deschizi', 'deschide', 'deschidem', 'deschideți', 'deschid'], part: 'deschis' },
  inchide: { inf: 'a închide', ru: 'закрывать', prezent: ['închid', 'închizi', 'închide', 'închidem', 'închideți', 'închid'], part: 'închis' },
  citi: { inf: 'a citi', ru: 'читать', prezent: ['citesc', 'citești', 'citește', 'citim', 'citiți', 'citesc'], part: 'citit' },
  hotari: { inf: 'a hotărî', ru: 'решать', prezent: ['hotărăsc', 'hotărăști', 'hotărăște', 'hotărâm', 'hotărâți', 'hotărăsc'], part: 'hotărât' },
  vorbi: { inf: 'a vorbi', ru: 'говорить', prezent: ['vorbesc', 'vorbești', 'vorbește', 'vorbim', 'vorbiți', 'vorbesc'], part: 'vorbit' },
  veni: { inf: 'a veni', ru: 'приходить', prezent: ['vin', 'vii', 'vine', 'venim', 'veniți', 'vin'], part: 'venit' },
  face: { inf: 'a face', ru: 'делать', prezent: ['fac', 'faci', 'face', 'facem', 'faceți', 'fac'], part: 'făcut' },
  manca: { inf: 'a mânca', ru: 'есть (кушать)', prezent: ['mănânc', 'mănânci', 'mănâncă', 'mâncăm', 'mâncați', 'mănâncă'], part: 'mâncat' },
  ajuta: { inf: 'a ajuta', ru: 'помогать', prezent: ['ajut', 'ajuți', 'ajută', 'ajutăm', 'ajutați', 'ajută'], part: 'ajutat' },
  intra: { inf: 'a intra', ru: 'входить', prezent: ['intru', 'intri', 'intră', 'intrăm', 'intrați', 'intră'], part: 'intrat' },
  alerga: { inf: 'a alerga', ru: 'бегать', prezent: ['alerg', 'alergi', 'aleargă', 'alergăm', 'alergați', 'aleargă'], part: 'alergat' },
  asculta: { inf: 'a asculta', ru: 'слушать', prezent: ['ascult', 'asculți', 'ascultă', 'ascultăm', 'ascultați', 'ascultă'], part: 'ascultat' },
};

export type Tense = 'prezent' | 'trecut' | 'viitor';
const TENSE_RU: Record<Tense, string> = { prezent: 'настоящее', trecut: 'прошедшее', viitor: 'будущее' };

export function conjugate(id: string, tense: Tense): string[] {
  const v = VERBS[id];
  if (tense === 'prezent') return v.prezent;
  if (tense === 'trecut') return AUX_PAST.map((a) => `${a} ${v.part}`);
  return AUX_FUT.map((a) => `${a} ${v.inf.slice(2)}`);
}

const rnd = (max: number) => Math.floor(Math.random() * max);

export function verbQuestions(ids: string[], tenses: Tense[], count: number, topic: string): Question[] {
  return Array.from({ length: count }, () => {
    const id = ids[rnd(ids.length)];
    const tense = tenses[rnd(tenses.length)];
    const forms = conjugate(id, tense);
    const p = rnd(6);
    const person = p === 2 ? (Math.random() < 0.5 ? 'El' : 'Ea') : p === 5 ? (Math.random() < 0.5 ? 'Ei' : 'Ele') : PERSONS[p];
    const prompt = `${person} ___ (${VERBS[id].inf}, ${TENSE_RU[tense]})`;
    const explain = `${VERBS[id].inf} (${tense}): ${forms.map((f, i) => `${['eu', 'tu', 'el/ea', 'noi', 'voi', 'ei/ele'][i]} ${f}`).join(', ')}`;
    const answer = forms[p];
    if (Math.random() < 0.5) return { kind: 'input', prompt, answer, explain, topic } satisfies Question;
    const options = [...new Set(forms)];
    return { kind: 'choice', prompt, options, answer, explain, topic } satisfies Question;
  });
}
