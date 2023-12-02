import { readFileSync } from 'fs';

const file = readFileSync('./input.txt', 'utf8');

const lines = file.split('\n');

const ColorsMap = new Map<string, number>([
  ['red', 3],
  ['green', 5],
  ['blue', 4],
]);

const isColorPossible = (color: string, value: number) => {
  if (color === 'red') {
    return value <= 12;
  }
  if (color === 'green') {
    return value <= 13;
  }
  if (color === 'blue') {
    return value <= 14;
  }
  return false;
};

let sum = 0;

lines.forEach((line) => {
  let gameId: number = 0;
  let gameData: string;
  let isValidGame = true;

  gameId = Number(line.split(':')[0].slice(5));
  gameData = line.split(':')[1].trim();

  gameData.split(';').forEach((gameSet) => {
    const values = gameSet.split(', ');

    values.forEach((value) => {
      for (let [color, colorLength] of ColorsMap) {
        if (value.includes(color)) {
          const colValue = Number(value.split(value.slice(-colorLength))[0]);
          if (!isColorPossible(color, colValue)) {
            isValidGame = false;
            break;
          }
        }
      }
    });
  });
  if (isValidGame) {
    sum += gameId;
  }
});

console.log(sum);
