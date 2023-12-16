import { readFileSync } from 'fs';

const matrices = readFileSync('./input.txt', 'utf8').split('\n\n');

const getHorisontalScore = (matrix: string) => {
  const lines = matrix.split('\n');
  let score = 0;

  for (let i = 0; i < lines.length - 1; i++) {
    const upArr: Array<string> = [];
    const downArr: Array<string> = [];
    let offset = 0;
    while (i - offset >= 0 || i + offset + 1 < lines.length) {
      const up = lines[i - offset];
      const down = lines[i + offset + 1];
      upArr.push(up);
      downArr.push(down);

      offset++;
    }

    const upstr = [...upArr].filter(Boolean).join('');
    const downstr = [...downArr].filter(Boolean).join('');

    if (
      upstr.substring(0, downstr.length) === downstr ||
      downstr.substring(0, upstr.length) === upstr
    ) {
      return upArr.filter(Boolean).length;
    }
  }
  return score;
};

const getVerticalScore = (matrix: string) => {
  const lines = matrix.split('\n');
  let score = 0;

  for (let i = 0; i < lines[0].length - 1; i++) {
    const leftArr: Array<string> = [];
    const rightArr: Array<string> = [];
    let offset = 0;
    while (i - offset >= 0 || i + offset + 1 < lines[0].length) {
      const up = lines.map((line) => line[i - offset]).join('');
      const down = lines.map((line) => line[i + offset + 1]).join('');
      leftArr.push(up);
      rightArr.push(down);

      offset++;
    }
    const upstr = [...leftArr].filter(Boolean).join('');
    const downstr = [...rightArr].filter(Boolean).join('');

    if (
      upstr.substring(0, downstr.length) === downstr ||
      downstr.substring(0, upstr.length) === upstr
    ) {
      return leftArr.filter(Boolean).length;
    }
  }
  return score;
};

let cols = 0;
let lines = 0;
matrices.forEach((matrix, matrixId) => {
  lines += getHorisontalScore(matrix);
  cols += getVerticalScore(matrix);
});

console.log(lines * 100 + cols);
