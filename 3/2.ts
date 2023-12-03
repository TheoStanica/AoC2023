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

interface INumberDetails {
  start: number;
  end: number;
  line: number;
  value: number;
}

const numberDetailsRecord = new Set<INumberDetails>();

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
        numberDetailsRecord.add({
          line: lineIndex,
          start: nrStart,
          end: nrEnd,
          value: nr,
        });
      }
      nrStart = undefined;
      nrEnd = undefined;
    }

    col++;
  } while (col <= line.length);
});

interface IGearPosition {
  line: number;
  col: number;
}

interface IGearData {
  valid: boolean;
  parts: Array<number>;
}

const getGearData = (gear: IGearPosition): IGearData => {
  let adjacentParts = new Set<number>();
  for (let i = gear.line - 1; i <= gear.line + 1; i++) {
    for (let j = gear.col - 1; j <= gear.col + 1; j++) {
      if (i === gear.line && j === gear.col) {
      } else {
        numberDetailsRecord.forEach((partData) => {
          if (partData.line === i && partData.start <= j && partData.end >= j) {
            adjacentParts.add(partData.value);
          }
        });
      }
    }
  }
  const partsArray = Array.from(adjacentParts);

  return {
    valid: partsArray.length > 0 && partsArray.length == 2 ? true : false,
    parts: partsArray,
  };
};

let sum = 0;
lines.forEach((line, lineIndex) => {
  const gearPositions: Array<number> = [];

  line.split('').find((el, index) => {
    if (el === '*') {
      gearPositions.push(index);
    }
  });
  gearPositions.forEach((pos) => {
    const { valid, parts } = getGearData({ col: pos, line: lineIndex });

    if (!valid) {
      return;
    }
    sum += parts[0] * parts[1];
  });
});

console.log(sum);
