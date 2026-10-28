import type { Question } from '../types';

export const questions: Question[] = [
  // participles
  { kind: 'input', prompt: 'Причастие: a lucra →', answer: 'lucrat', explain: '-a → -at' },
  { kind: 'input', prompt: 'Причастие: a mânca →', answer: 'mâncat', explain: '-a → -at' },
  { kind: 'input', prompt: 'Причастие: a cumpăra →', answer: 'cumpărat', explain: '-a → -at' },
  { kind: 'input', prompt: 'Причастие: a vedea →', answer: 'văzut', explain: '-ea → -ut (vedea → văzut)' },
  { kind: 'input', prompt: 'Причастие: a avea →', answer: 'avut', explain: '-ea → -ut' },
  { kind: 'input', prompt: 'Причастие: a putea →', answer: 'putut', explain: '-ea → -ut' },
  { kind: 'input', prompt: 'Причастие: a face →', answer: 'făcut', explain: 'a face → făcut' },
  { kind: 'input', prompt: 'Причастие: a merge →', answer: 'mers', explain: 'a merge → mers (нужно запомнить)' },
  { kind: 'input', prompt: 'Причастие: a scrie →', answer: 'scris', explain: 'a scrie → scris' },
  { kind: 'input', prompt: 'Причастие: a dormi →', answer: 'dormit', explain: '-i → -it' },
  { kind: 'input', prompt: 'Причастие: a veni →', answer: 'venit', explain: '-i → -it' },
  { kind: 'input', prompt: 'Причастие: a coborî →', answer: 'coborât', explain: '-î → -ât' },
  { kind: 'input', prompt: 'Причастие: a fi →', answer: 'fost', explain: 'a fi → fost (неправильный)' },
  { kind: 'input', prompt: 'Причастие: a bea →', answer: 'băut', explain: 'a bea → băut (неправильный)' },
  { kind: 'choice', prompt: 'Причастие от «a deschide»:', options: ['deschis', 'deschidut', 'deschidat'], answer: 'deschis', explain: 'a deschide → deschis' },
  { kind: 'choice', prompt: 'Причастие от «a lua»:', options: ['luat', 'luut', 'luit'], answer: 'luat', explain: 'a lua → luat' },
  { kind: 'choice', prompt: 'Причастие от «a pune»:', options: ['pus', 'punut', 'punit'], answer: 'pus', explain: 'a pune → pus' },
  { kind: 'choice', prompt: 'Причастие от «a vrea»:', options: ['vrut', 'vreat', 'vrit'], answer: 'vrut', explain: 'a vrea → vrut' },
  // auxiliary
  { kind: 'choice', prompt: 'El ___ mâncat acasă.', options: ['a', 'are', 'am'], answer: 'a', explain: 'В прошедшем «он / она» = a, не are' },
  { kind: 'choice', prompt: 'Noi ___ fost la Brașov.', options: ['am', 'au', 'ați'], answer: 'am', explain: 'noi → am (как и eu)' },
  { kind: 'choice', prompt: 'Voi ___ văzut filmul?', options: ['ați', 'ai', 'au'], answer: 'ați', explain: 'voi → ați' },
  { kind: 'choice', prompt: 'Ei ___ venit ieri.', options: ['au', 'a', 'am'], answer: 'au', explain: 'ei / ele → au' },
  { kind: 'choice', prompt: '«Am mers la școală.» Кто ходил?', options: ['я или мы', 'только я', 'он'], answer: 'я или мы', explain: 'am = eu am / noi am' },
  { kind: 'choice', prompt: 'Что значит «Am citit o carte»?', options: ['Я прочитал книгу.', 'У меня есть книга.', 'Я читаю книгу.'], answer: 'Я прочитал книгу.', explain: 'am + причастие = прошедшее время' },
  // find the correct sentence
  { kind: 'choice', prompt: 'Какое предложение правильное?', options: ['Ea a venit.', 'Ea are venit.', 'Ea a venită.'], answer: 'Ea a venit.', explain: 'Причастие не меняется по роду' },
  { kind: 'choice', prompt: 'Какое предложение правильное?', options: ['Am făcut temele.', 'Am facut temele.', 'Am făcat temele.'], answer: 'Am făcut temele.', explain: 'a face → făcut' },
  // negation
  { kind: 'choice', prompt: 'Как сказать «Я не ел»?', options: ['N-am mâncat.', 'Am nu mâncat.', 'Nu mâncat am.'], answer: 'N-am mâncat.', explain: 'nu + am = n-am' },
  { kind: 'input', prompt: 'Сделай отрицание: Ea a venit.', answer: ['Ea nu a venit', 'Ea n-a venit', 'Nu a venit', 'N-a venit'] },
  { kind: 'input', prompt: 'Сделай отрицание: Am văzut filmul.', answer: ['Nu am văzut filmul', 'N-am văzut filmul'] },
  // time words
  { kind: 'input', prompt: 'Переведи: вчера', answer: 'ieri' },
  { kind: 'input', prompt: 'Переведи: в прошлом году', answer: 'anul trecut' },
  { kind: 'input', prompt: 'Переведи: на прошлой неделе', answer: 'săptămâna trecută' },
  { kind: 'choice', prompt: '«aseară» значит:', options: ['вчера вечером', 'сегодня утром', 'завтра вечером'], answer: 'вчера вечером' },
  { kind: 'choice', prompt: '«acum două zile» значит:', options: ['два дня назад', 'через два дня', 'два дня подряд'], answer: 'два дня назад' },
  // translation
  { kind: 'input', prompt: 'Переведи: Вчера я работал дома.', answer: ['Ieri am lucrat acasă', 'Am lucrat acasă ieri', 'Ieri eu am lucrat acasă'] },
  { kind: 'input', prompt: 'Переведи: Мы были в Румынии.', answer: ['Am fost în România', 'Noi am fost în România'] },
  { kind: 'input', prompt: 'Переведи: Ты поел?', answer: ['Ai mâncat', 'Tu ai mâncat'] },
  { kind: 'input', prompt: 'Переведи: Они купили машину.', answer: ['Ei au cumpărat o mașină', 'Au cumpărat o mașină', 'Ele au cumpărat o mașină'] },
  { kind: 'input', prompt: 'Переведи: Она выпила кофе.', answer: ['Ea a băut o cafea', 'Ea a băut cafea', 'A băut o cafea'] },
  { kind: 'input', prompt: 'Переведи: Что ты делал вчера?', answer: ['Ce ai făcut ieri', 'Ce ai făcut tu ieri'] },
  { kind: 'input', prompt: 'Поставь в прошедшее: Eu merg la magazin.', answer: ['Eu am mers la magazin', 'Am mers la magazin'] },
  { kind: 'input', prompt: 'Поставь в прошедшее: Noi vedem un film.', answer: ['Noi am văzut un film', 'Am văzut un film'] },
];
