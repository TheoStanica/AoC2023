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

  gameId = Number(line.split(':')[0].slice(5));
  gameData = line.split(':')[1].trim();

  //              r  g  b
  let maximums = [1, 1, 1];

  gameData.split(';').forEach((gameSet) => {
    // get max red, green, blue in the set
    // r g b
    const values = gameSet.split(', ');

    values.forEach((value) => {
      for (let [color, colorLength] of ColorsMap) {
        if (value.includes(color)) {
          const colValue = Number(value.split(value.slice(-colorLength))[0]);
          if (color === 'red') {
            if (maximums[0] < colValue) {
              maximums[0] = colValue;
            }
          }
          if (color === 'green') {
            if (maximums[1] < colValue) {
              maximums[1] = colValue;
            }
          }
          if (color === 'blue') {
            if (maximums[2] < colValue) {
              maximums[2] = colValue;
            }
          }
        }
      }
    });
  });

  const setPower = maximums.reduce((acc, val) => acc * val, 1);
  sum += setPower;
});

console.log(sum);
