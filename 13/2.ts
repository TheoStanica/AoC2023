import { readFileSync } from 'fs';

const matrices = readFileSync('./input.txt', 'utf8').split('\n\n');

const findHorisontalSmudge = (matrix: Array<Array<string>>) => {
  for (let i = 0; i < matrix.length - 1; i++) {
    let mismatchedI = -1;
    let mismatchedJ = -1;
    let mirrorLength = Math.min(i + 1, matrix.length - i - 1);

    let isMirrorValid = true;

    for (let j = 0; j < matrix[0].length; j++) {
      for (let k = 0; k < mirrorLength; k++) {
        const up = matrix[i - k][j];
        const down = matrix[i + k + 1][j];

        if (up !== down) {
          if (mismatchedI === -1 && mismatchedJ === -1) {
            mismatchedI = i - k;
            mismatchedJ = j;
          } else {
            isMirrorValid = false;
          }
        }
      }
    }

    if (isMirrorValid && mismatchedI !== -1) {
      const fix = matrix[mismatchedI][mismatchedJ] === '#' ? '.' : '#';
      matrix[mismatchedI][mismatchedJ] = fix;
      return { updated: true, score: i + 1 };
    }
  }
  return { updated: false, score: 0 };
};

const findVerticalSmudge = (matrix: Array<Array<string>>) => {
  for (let j = 0; j <= matrix[0].length; j++) {
    let mismatchedI = -1;
    let mismatchedK = -1;
    let mirrorLength = Math.min(j + 1, matrix[0].length - j - 1);
    let isMirrorValid = true;

    for (let i = 0; i < matrix.length; i++) {
      for (let k = 0; k < mirrorLength; k++) {
        const left = matrix[i][j - k];
        const right = matrix[i][j + k + 1];

        if (left !== right) {
          if (mismatchedI === -1 && mismatchedK === -1) {
            mismatchedI = i;
            mismatchedK = j - k;
          } else {
            isMirrorValid = false;
          }
        }
      }
    }

    if (isMirrorValid && mismatchedI !== -1) {
      const fix = matrix[mismatchedI][mismatchedK] === '#' ? '.' : '#';
      matrix[mismatchedI][mismatchedK] = fix;

      return { updated: true, score: j + 1 };
    }
  }
  return { updated: false, score: 0 };
};

let cols = 0;
let lines = 0;

matrices.forEach((matrix) => {
  const _matrix: Array<Array<string>> = [];

  matrix.split('\n').forEach((line) => {
    _matrix.push(line.split(''));
  });

  const { updated, score: _hscore } = findHorisontalSmudge(_matrix);

  if (updated) {
    lines += _hscore;
  } else {
    const { score: _vscore } = findVerticalSmudge(_matrix);
    cols += _vscore;
  }
});

console.log(lines * 100 + cols);
