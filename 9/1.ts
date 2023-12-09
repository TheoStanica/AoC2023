import { readFileSync } from 'fs';

const lines = readFileSync('./input.txt', 'utf8').split('\n');

let total = 0;
lines.forEach((line, index) => {
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
  } while (!differencesArray.every((nr) => nr === differencesArray[0]));

  let currentDif = 0;
  for (let i = stepsToDifferencesMap.size - 1; i >= 0; i--) {
    const numberArr = stepsToDifferencesMap.get(i) || [];
    const lastNumber = numberArr[numberArr.length - 1];
    stepsToDifferencesMap.set(i, [
      ...(stepsToDifferencesMap.get(i) || []),
      currentDif + lastNumber,
    ]);

    currentDif += lastNumber;
  }

  const _firstArr = stepsToDifferencesMap.get(0) || [];
  const value = _firstArr[_firstArr.length - 1];
  total += value;
});

console.log(total);
