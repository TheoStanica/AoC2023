import { readFileSync } from 'fs';

const file = readFileSync('./input.txt', 'utf8');

let time: number | undefined = undefined;
let records: number | undefined = undefined;

file.split('\n').forEach((line, index) => {
  const data = line
    .split(':')[1]
    .split(' ')
    .filter((str) => Boolean(str));

  let totalNrString = '';
  data.forEach((str) => (totalNrString += str));
  if (index === 0) {
    time = Number(totalNrString);
  } else {
    records = Number(totalNrString);
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

if (time && records) {
  console.log(getNrOfPossibleWins(time, records));
}
