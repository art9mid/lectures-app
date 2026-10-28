import type { Question } from '../types';

export const questions: Question[] = [
  { kind: 'choice', prompt: 'Eu ___ numesc Ana.', options: ['mă', 'te', 'se'], answer: 'mă', explain: 'eu → mă' },
  { kind: 'choice', prompt: 'Tu ___ trezești devreme.', options: ['te', 'mă', 'vă'], answer: 'te', explain: 'tu → te' },
  { kind: 'choice', prompt: 'El ___ simte bine.', options: ['se', 'te', 'ne'], answer: 'se', explain: 'el / ea → se' },
  { kind: 'choice', prompt: 'Noi ___ întâlnim mâine.', options: ['ne', 'vă', 'se'], answer: 'ne', explain: 'noi → ne' },
  { kind: 'choice', prompt: 'Voi ___ grăbiți?', options: ['vă', 'ne', 'te'], answer: 'vă', explain: 'voi → vă' },
  { kind: 'choice', prompt: 'Ele ___ odihnesc.', options: ['se', 'ne', 'mă'], answer: 'se', explain: 'ei / ele → se (как и у «он / она»)' },
  { kind: 'choice', prompt: 'Как вежливо спросить «Как вас зовут?»', options: ['Cum vă numiți?', 'Cum te numești?', 'Cum se numesc?'], answer: 'Cum vă numiți?', explain: 'Вежливая форма = voi: vă numiți' },
  { kind: 'choice', prompt: '«Mă bucur să vă cunosc» значит:', options: ['Рад с вами познакомиться.', 'Я спешу к вам.', 'Я вас не знаю.'], answer: 'Рад с вами познакомиться.' },
  { kind: 'choice', prompt: '«Eu spăl mașina» или «Eu mă spăl» = Я моюсь?', options: ['Eu mă spăl.', 'Eu spăl mașina.'], answer: 'Eu mă spăl.', explain: 'Действие на себя → частица mă' },
  { kind: 'choice', prompt: 'Где ставится «nu»?', options: ['Eu nu mă grăbesc.', 'Eu mă nu grăbesc.', 'Eu mă grăbesc nu.'], answer: 'Eu nu mă grăbesc.', explain: 'nu стоит перед частицей' },
  { kind: 'choice', prompt: 'Прошедшее: eu + a se trezi', options: ['m-am trezit', 'mă am trezit', 'am mă trezit'], answer: 'm-am trezit', explain: 'mă + am = m-am' },
  { kind: 'choice', prompt: 'Прошедшее: ea + a se îmbrăca', options: ['s-a îmbrăcat', 'se a îmbrăcat', 's-au îmbrăcat'], answer: 's-a îmbrăcat', explain: 'se + a = s-a (он / она)' },
  { kind: 'choice', prompt: 'Прошедшее: ei + a se întâlni', options: ['s-au întâlnit', 's-a întâlnit', 'se au întâlnit'], answer: 's-au întâlnit', explain: 'se + au = s-au (они)' },
  { kind: 'choice', prompt: 'Прошедшее: voi + a se odihni', options: ['v-ați odihnit', 'vă ați odihnit', 'ne-am odihnit'], answer: 'v-ați odihnit', explain: 'vă + ați = v-ați' },
  { kind: 'choice', prompt: 'Будущее: «я проснусь»', options: ['mă voi trezi', 'voi mă trezi', 'mă va trezi'], answer: 'mă voi trezi', explain: 'частица стоит перед voi' },
  { kind: 'choice', prompt: '«a se culca» значит:', options: ['ложиться спать', 'одеваться', 'спешить'], answer: 'ложиться спать' },
  { kind: 'choice', prompt: '«a se grăbi» значит:', options: ['спешить', 'радоваться', 'отдыхать'], answer: 'спешить' },
  { kind: 'input', prompt: 'Переведи: Меня зовут Ана.', answer: ['Mă numesc Ana', 'Eu mă numesc Ana'] },
  { kind: 'input', prompt: 'Переведи: Как тебя зовут?', answer: 'Cum te numești' },
  { kind: 'input', prompt: 'Переведи: Как ты себя чувствуешь?', answer: 'Cum te simți' },
  { kind: 'input', prompt: 'Переведи: Я чувствую себя хорошо.', answer: ['Mă simt bine', 'Eu mă simt bine'] },
  { kind: 'input', prompt: 'Переведи: Я не спешу.', answer: ['Nu mă grăbesc', 'Eu nu mă grăbesc'] },
  { kind: 'input', prompt: 'Переведи: Вчера я проснулся поздно.', answer: ['Ieri m-am trezit târziu', 'M-am trezit târziu ieri'] },
  { kind: 'input', prompt: 'Переведи: Мы встречаемся в пять.', answer: ['Ne întâlnim la cinci', 'Ne întâlnim la ora cinci', 'Noi ne întâlnim la ora cinci', 'Noi ne întâlnim la cinci'] },
  { kind: 'input', prompt: 'Переведи: Завтра я отдохну.', answer: ['Mâine mă voi odihni', 'Mâine o să mă odihnesc'] },
  { kind: 'input', prompt: 'Переведи: Ребёнок одевается.', answer: 'Copilul se îmbracă' },
  { kind: 'input', prompt: 'Поставь в прошедшее: Eu mă spăl.', answer: ['Eu m-am spălat', 'M-am spălat'] },
  { kind: 'input', prompt: 'Поставь в прошедшее: Noi ne odihnim.', answer: ['Noi ne-am odihnit', 'Ne-am odihnit'] },
];

// prezent: eu, tu, el/ea, noi, voi, ei/ele (without the particle)
const REFL: { inf: string; prezent: string[]; part: string }[] = [
  { inf: 'numi', prezent: ['numesc', 'numești', 'numește', 'numim', 'numiți', 'numesc'], part: 'numit' },
  { inf: 'trezi', prezent: ['trezesc', 'trezești', 'trezește', 'trezim', 'treziți', 'trezesc'], part: 'trezit' },
  { inf: 'spăla', prezent: ['spăl', 'speli', 'spală', 'spălăm', 'spălați', 'spală'], part: 'spălat' },
  { inf: 'îmbrăca', prezent: ['îmbrac', 'îmbraci', 'îmbracă', 'îmbrăcăm', 'îmbrăcați', 'îmbracă'], part: 'îmbrăcat' },
  { inf: 'simți', prezent: ['simt', 'simți', 'simte', 'simțim', 'simțiți', 'simt'], part: 'simțit' },
  { inf: 'întâlni', prezent: ['întâlnesc', 'întâlnești', 'întâlnește', 'întâlnim', 'întâlniți', 'întâlnesc'], part: 'întâlnit' },
  { inf: 'odihni', prezent: ['odihnesc', 'odihnești', 'odihnește', 'odihnim', 'odihniți', 'odihnesc'], part: 'odihnit' },
  { inf: 'grăbi', prezent: ['grăbesc', 'grăbești', 'grăbește', 'grăbim', 'grăbiți', 'grăbesc'], part: 'grăbit' },
  { inf: 'bucura', prezent: ['bucur', 'bucuri', 'bucură', 'bucurăm', 'bucurați', 'bucură'], part: 'bucurat' },
  { inf: 'culca', prezent: ['culc', 'culci', 'culcă', 'culcăm', 'culcați', 'culcă'], part: 'culcat' },
];

const PARTICLE = ['mă', 'te', 'se', 'ne', 'vă', 'se'];
const PAST = ['m-am', 'te-ai', 's-a', 'ne-am', 'v-ați', 's-au'];
const FUT = ['voi', 'vei', 'va', 'vom', 'veți', 'vor'];
const TENSES = [
  { id: 'prezent', ru: 'настоящее' },
  { id: 'trecut', ru: 'прошедшее' },
  { id: 'viitor', ru: 'будущее' },
] as const;

const rnd = (max: number) => Math.floor(Math.random() * max);

function forms(v: (typeof REFL)[number], tense: (typeof TENSES)[number]['id']): string[] {
  return PARTICLE.map((p, i) =>
    tense === 'prezent' ? `${p} ${v.prezent[i]}` : tense === 'trecut' ? `${PAST[i]} ${v.part}` : `${p} ${FUT[i]} ${v.inf}`,
  );
}

export function generate(): Question[] {
  return Array.from({ length: 10 }, () => {
    const v = REFL[rnd(REFL.length)];
    const t = TENSES[rnd(TENSES.length)];
    const all = forms(v, t.id);
    const p = rnd(6);
    const person = p === 2 ? (Math.random() < 0.5 ? 'El' : 'Ea') : p === 5 ? (Math.random() < 0.5 ? 'Ei' : 'Ele') : ['Eu', 'Tu', '', 'Noi', 'Voi'][p];
    const prompt = `${person} ___ (a se ${v.inf}, ${t.ru})`;
    const explain = `a se ${v.inf} (${t.id}): ${all.join(', ')}`;
    if (Math.random() < 0.5) return { kind: 'input', prompt, answer: all[p], explain, topic: 'reflexive' } satisfies Question;
    return { kind: 'choice', prompt, options: [...new Set(all)], answer: all[p], explain, topic: 'reflexive' } satisfies Question;
  });
}
