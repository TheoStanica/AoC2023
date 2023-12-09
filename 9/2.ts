import { readFileSync } from 'fs';

const lines = readFileSync('./input.txt', 'utf8').split('\n');

let total = 0;
lines.forEach((line) => {
  const readings = line.split(' ').map((str) => Number(str));
  let differencesArray: Array<number> = [];
  let step = 0;
  const stepsToDifferencesMap = new Map<number, Array<number>>();

  differencesArray = readings;
  stepsToDifferencesMap.set(step, differencesArray);

  step++;

  do {
    let _differencesArray: Array<number> = [];
    for (let i = 1; i < differencesArray.length; i++) {
      _differencesArray.push(differencesArray[i] - differencesArray[i - 1]);
    }

    differencesArray = _differencesArray;
    stepsToDifferencesMap.set(step, differencesArray);
    step++;
  } while (!differencesArray.every((nr) => nr === 0));

  let currentDif = 0;
  for (let i = stepsToDifferencesMap.size - 1; i >= 0; i--) {
    const numberArr = stepsToDifferencesMap.get(i) || [];
    const firstNumber = numberArr[0];
    stepsToDifferencesMap.set(i, [
      firstNumber - currentDif,
      ...(stepsToDifferencesMap.get(i) || []),
    ]);

    currentDif = firstNumber - currentDif;
  }

  const _firstArr = stepsToDifferencesMap.get(0) || [];
  const value = _firstArr[0];
  total += value;
});

console.log(total);
