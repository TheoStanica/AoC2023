import { readFileSync } from 'fs';

const file = readFileSync('./input.txt', { encoding: 'utf8' });

const lines = file.split('\n');

const letterNumbersMap = new Map<string, string>([
  ['one', '1'],
  ['two', '2'],
  ['three', '3'],
  ['four', '4'],
  ['five', '5'],
  ['six', '6'],
  ['seven', '7'],
  ['eight', '8'],
  ['nine', '9'],
]);

const isDigit = (chr: string): boolean => {
  return chr >= '0' && chr <= '9';
};

let sum = 0;
for (let line of lines) {
  let firstDigit;
  let lastDigit;

  for (let i = 0; i < line.length; i++) {
    let chr = line[i];
    if (isDigit(chr)) {
      if (!firstDigit) {
        firstDigit = Number(chr);
      }
      if (firstDigit) {
        lastDigit = Number(chr);
      }
    }

    for (let substrLength of [3, 4, 5]) {
      const substring = line.substring(i, i + substrLength);
      const value = letterNumbersMap.get(substring);
      if (value) {
        if (!firstDigit) {
          firstDigit = Number(value);
        }
        if (firstDigit) {
          lastDigit = Number(value);
        }
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
