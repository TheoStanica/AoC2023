import { readFileSync } from 'fs';

const file = readFileSync('./input.txt', 'utf8');

let schematic: Array<string> = [];

let lines = file.split('\n');
lines.forEach((line) => schematic.push(line));

const isDigit = (chr: string) => {
  return chr >= '0' && chr <= '9';
};

const isValidPartNumber = (
  line: number,
  start: number,
  end: number
): boolean => {
  let isValid = false;
  for (let i = line - 1; i <= line + 1; i++) {
    for (let j = start - 1; j <= end + 1; j++) {
      const chr = lines[i]?.[j];
      if (chr === undefined) {
        continue;
      }
      if (!isDigit(chr) && chr !== '.') {
        isValid = true;
      }
    }
  }
  return isValid;
};

let sum = 0;
lines.forEach((line, lineIndex) => {
  let col = 0;
  let nrStart: number | undefined = undefined;
  let nrEnd: number | undefined = undefined;
  do {
    if (isDigit(line[col])) {
      if (nrStart === undefined) {
        nrStart = col;
      }
      nrEnd = col;
    } else {
      if (
        nrStart !== undefined &&
        nrEnd !== undefined &&
        isValidPartNumber(lineIndex, nrStart, nrEnd)
      ) {
        const nr = Number(line.slice(nrStart, nrEnd + 1));
        sum += nr;
      }
      nrStart = undefined;
      nrEnd = undefined;
    }

    col++;
  } while (col <= line.length);
});

console.log(sum);
