// Run: node scripts/check-numbers.mts — examples copied from Lecția 0.
import assert from 'node:assert';
import { toWords } from '../src/lib/quiz/numbers.ts';
const cases: [number, string][] = [
  [11, 'unsprezece'], [14, 'paisprezece'], [16, 'șaisprezece'], [60, 'șaizeci'],
  [21, 'douăzeci și unu'], [22, 'douăzeci și doi'], [100, 'o sută'], [200, 'două sute'],
  [125, 'o sută douăzeci și cinci'], [999, 'nouă sute nouăzeci și nouă'],
  [1000, 'o mie'], [2000, 'două mii'], [10000, 'zece mii'], [12000, 'douăsprezece mii'],
  [25000, 'douăzeci și cinci de mii'], [83000, 'optzeci și trei de mii'],
  [1250, 'o mie două sute cincizeci'], [5612, 'cinci mii șase sute doisprezece'],
  [100000, 'o sută de mii'], [999000, 'nouă sute nouăzeci și nouă de mii'],
  [1000000, 'un milion'], [2000000, 'două milioane'],
  [1250000, 'un milion două sute cincizeci de mii'],
  [2340500, 'două milioane trei sute patruzeci de mii cinci sute'],
  [5001200, 'cinci milioane o mie două sute'],
  [7845921, 'șapte milioane opt sute patruzeci și cinci de mii nouă sute douăzeci și unu'],
];
for (const [n, w] of cases) assert.equal(toWords(n), w, String(n));
console.log(`ok ${cases.length} cases`);
