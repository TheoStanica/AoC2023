import { readFileSync } from 'fs';

const file = readFileSync('./input.txt', { encoding: 'utf8' });

const lines = file.split('\n');

const isDigit = (chr: string): boolean => {
  return chr >= '0' && chr <= '9';
};

let sum = 0;
for (let line of lines) {
  let firstDigit;
  let lastDigit;

  for (let chr of line) {
    if (isDigit(chr)) {
      if (!firstDigit) {
        firstDigit = Number(chr);
      }
      if (firstDigit) {
        lastDigit = Number(chr);
      }
    }
  }
  if (!firstDigit) {
    continue;
  }
  if (!lastDigit) {
    lastDigit = firstDigit;
  }

  sum += firstDigit * 10 + lastDigit;
}

console.log(sum);
