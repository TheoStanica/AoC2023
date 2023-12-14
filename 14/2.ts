import { readFileSync } from 'fs';

const lines = readFileSync('input.txt', 'utf8').split('\n');

let map: Array<Array<string>> = [];

const obstaclesMap = new Map<string, string>();

lines.forEach((line, lineIdx) => {
  map.push(line.split(''));

  line.split('').forEach((chr, colIdx) => {
    if (chr === 'O' || chr === '#') {
      obstaclesMap.set(`${lineIdx}-${colIdx}`, chr);
    }
  });
});

const tiltNorth = () => {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      const obstacle = obstaclesMap.get(`${i}-${j}`);
      if (obstacle && obstacle === 'O') {
        let currentLine = i;
        while (
          !obstaclesMap.get(`${currentLine - 1}-${j}`) &&
          currentLine - 1 >= 0
        ) {
          currentLine--;
        }
        if (currentLine !== i) {
          obstaclesMap.set(`${currentLine}-${j}`, obstacle);
          obstaclesMap.delete(`${i}-${j}`);
        }
      }
    }
  }
};

const tiltSouth = () => {
  for (let i = lines.length - 1; i >= 0; i--) {
    for (let j = lines.length - 1; j >= 0; j--) {
      const obstacle = obstaclesMap.get(`${i}-${j}`);
      if (obstacle && obstacle === 'O') {
        let currentLine = i;
        while (
          !obstaclesMap.get(`${currentLine + 1}-${j}`) &&
          currentLine + 1 < lines.length
        ) {
          currentLine++;
        }
        if (currentLine !== i) {
          obstaclesMap.set(`${currentLine}-${j}`, obstacle);
          obstaclesMap.delete(`${i}-${j}`);
        }
      }
    }
  }
};

const tiltEast = () => {
  for (let i = 0; i < lines.length; i++) {
    for (let j = lines.length - 1; j >= 0; j--) {
      const obstacle = obstaclesMap.get(`${i}-${j}`);
      if (obstacle && obstacle === 'O') {
        let currentCol = j;
        while (
          !obstaclesMap.get(`${i}-${currentCol + 1}`) &&
          currentCol + 1 < lines.length
        ) {
          currentCol++;
        }
        if (currentCol !== j) {
          obstaclesMap.set(`${i}-${currentCol}`, obstacle);
          obstaclesMap.delete(`${i}-${j}`);
        }
      }
    }
  }
};

const tiltWest = () => {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      const obstacle = obstaclesMap.get(`${i}-${j}`);
      if (obstacle && obstacle === 'O') {
        let currentCol = j;
        while (
          !obstaclesMap.get(`${i}-${currentCol - 1}`) &&
          currentCol - 1 >= 0
        ) {
          currentCol--;
        }
        if (currentCol !== j) {
          obstaclesMap.set(`${i}-${currentCol}`, obstacle);
          obstaclesMap.delete(`${i}-${j}`);
        }
      }
    }
  }
};

const cycle = () => {
  tiltNorth();
  tiltWest();
  tiltSouth();
  tiltEast();
};

const computeLoad = () => {
  let sum = 0;
  for (let [key, value] of obstaclesMap) {
    if (value !== '#') {
      sum += lines.length - Number(key.split('-')[0]);
    }
  }
  return sum;
};

let cycleNo = 0;
const MAX_SAMPLE_CYCLES = 500;
const CYCLES = 1000000000;
const sampleLoads: Array<number> = [];

while (cycleNo <= MAX_SAMPLE_CYCLES) {
  sampleLoads.push(computeLoad());
  cycle();
  cycleNo++;
}

function findRepeatingSequence(
  arr: number[]
): { sequence: number[]; start: number } | null {
  const n = arr.length;

  for (let start = 0; start < n - 1; start++) {
    for (let length = 1; length <= (n - start) / 2; length++) {
      const sequence = arr.slice(start, start + length);
      let isRepeating = true;

      for (let i = start; i < n; i += length) {
        if (
          !arr
            .slice(i, i + length)
            .every((value, index) => value === sequence[index])
        ) {
          isRepeating = false;
          break;
        }
      }

      if (isRepeating) {
        return { sequence, start };
      }
    }
  }

  return null;
}

const a = findRepeatingSequence(sampleLoads);
if (a) {
  const { sequence, start } = a;

  console.log(sequence[(CYCLES - start) % sequence.length]);
}
