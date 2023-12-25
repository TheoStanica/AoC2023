import { readFileSync } from 'fs';

const lines = readFileSync('input.txt', 'utf8').split('\n');

let maxL = 0;
let minL = 0;
let maxC = 0;
let minC = 0;

let currentI = 0;
let currentJ = 0;
lines.forEach((line) => {
  const [command, _length, color] = line.split(' ');
  const length = Number(_length);
  switch (command) {
    case 'R': {
      currentJ += length;
      break;
    }
    case 'L': {
      currentJ -= length;
      break;
    }
    case 'U': {
      currentI -= length;
      break;
    }
    case 'D': {
      currentI += length;
      break;
    }
  }

  if (currentJ < minC) {
    minC = currentJ;
  }
  if (currentJ > maxC) {
    maxC = currentJ;
  }

  if (currentI < minL) {
    minL = currentI;
  }
  if (currentI > maxL) {
    maxL = currentI;
  }
});

const plan: Array<Array<string>> = [];

for (let i = 0; i <= Math.abs(minL) + Math.abs(maxL); i++) {
  const line = Array.from({ length: Math.abs(minC) + Math.abs(maxC) }).map(
    (c) => '.'
  );
  plan.push(line);
}

currentI = Math.abs(minL);
currentJ = Math.abs(minC);
plan[currentI][currentJ] = '#';

const fillMap = (command: string, length: number) => {
  switch (command) {
    case 'R': {
      for (let j = currentJ; j <= currentJ + length; j++) {
        plan[currentI][j] = '#';
      }
      currentJ += length;
      break;
    }
    case 'L': {
      for (let j = currentJ; j >= currentJ - length; j--) {
        plan[currentI][j] = '#';
      }
      currentJ -= length;
      break;
    }
    case 'D': {
      for (let i = currentI; i <= currentI + length; i++) {
        plan[i][currentJ] = '#';
      }
      currentI += length;
      break;
    }
    case 'U': {
      for (let i = currentI; i >= currentI - length; i--) {
        plan[i][currentJ] = '#';
      }
      currentI -= length;
      break;
    }
    default: {
      return;
    }
  }
};

lines.forEach((line) => {
  const [command, length, color] = line.split(' ');
  fillMap(command, Number(length));
});

const floodFill = (i: number, j: number) => {
  const visited: Array<string> = [];
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  visited.push(`${i}-${j}`);

  while (visited.length > 0) {
    const lastEl = visited.pop();
    if (lastEl === undefined) {
      break;
    }
    const [_elI, _elJ] = lastEl.split('-');

    const elI = Number(_elI);
    const elJ = Number(_elJ);
    plan[elI][elJ] = '#';
    directions.forEach((dir) => {
      if (plan[elI + dir[0]]?.[elJ + dir[1]] === '.') {
        visited.push(`${elI + dir[0]}-${elJ + dir[1]}`);
      }
    });
  }
};

let innerI = -1;
let innerJ = -1;
// find an inner element
for (let i = 0; i < plan.length; i++) {
  if (innerI !== -1 && innerJ !== -1) {
    break;
  }
  for (let j = 1; j < plan[0].length - 1; j++) {
    if (
      plan[i][j - 1] === '.' &&
      plan[i][j] === '#' &&
      plan[i][j + 1] === '.'
    ) {
      innerI = i;
      innerJ = j + 2;
      break;
    }
  }
}

floodFill(innerI, innerJ);

let result = 0;
plan.forEach((line) => {
  line.forEach((chr) => {
    if (chr === '#') {
      result++;
    }
  });
});

console.log(result);
