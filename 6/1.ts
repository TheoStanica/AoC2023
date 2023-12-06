import { readFileSync } from 'fs';

const file = readFileSync('./input.txt', 'utf8');

let time: Array<number> = [];
let records: Array<number> = [];

file.split('\n').forEach((line, index) => {
  const data = line
    .split(':')[1]
    .split(' ')
    .filter((str) => Boolean(str))
    .map((str) => Number(str));
  if (index === 0) {
    time = data;
  } else {
    records = data;
  }
});

const getNrOfPossibleWins = (time: number, record: number) => {
  let count = 0;

  for (let i = 1; i <= time - 1; i++) {
    const score = (time - i) * i;

    if (score > record) {
      count++;
    }
  }

  return count;
};

let total = 1;
time.forEach((time, index) => {
  const count = getNrOfPossibleWins(time, records[index]);

  if (count > 0) {
    total *= count;
  }
});
console.log(total);
