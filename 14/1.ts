import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf8');

let map: Array<Array<string>> = [];

file.split('\n').forEach((line) => {
  map.push(line.split(''));
});

// tilt North
map.forEach((line, lineIdx) => {
  line.forEach((chr, colIdx) => {
    if (chr === 'O') {
      let currentLine = lineIdx;

      let length = 0;
      while (
        map[currentLine - 1]?.[colIdx] !== undefined &&
        map[currentLine - 1]?.[colIdx] !== 'O' &&
        map[currentLine - 1]?.[colIdx] !== '#'
      ) {
        length++;
        currentLine--;
      }

      map[lineIdx][colIdx] = '.';
      map[lineIdx - length][colIdx] = 'O';
    }
  });
});

let score = 0;
map.forEach((line, lineIdx) => {
  line.forEach((chr) => {
    if (chr !== 'O') {
      return;
    }
    const chrScore = line.length - lineIdx;
    score += chrScore;
  });
});

console.log(score);
