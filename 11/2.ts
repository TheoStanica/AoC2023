import { readFileSync } from 'fs';

const lines = readFileSync('./input.txt', 'utf8').split('\n');
const emptySpaceLength = 999999;

let space: Array<Array<string>> = [];
lines.forEach((line) => {
  space.push(line.split(''));
});

let maxLine = space.length;
let maxCol = space.length;
let emptyLines: Array<number> = [];
let emptyCols: Array<number> = [];
lines.forEach((line, lineidx) => {
  if (line.split('').every((chr) => chr === '.')) {
    emptyLines.push(lineidx);
  }
});

for (let j = 0; j < maxCol; j++) {
  const colArr: Array<string> = [];

  for (let i = 0; i < maxLine; i++) {
    colArr.push(space[i][j]);
  }

  if (colArr.every((chr) => chr === '.')) {
    emptyCols.push(j);
  }
}

const galaxySet = new Set<string>();
const galaxyPairSet = new Set<string>();

lines.forEach((line, lineIdx) => {
  line.split('').forEach((chr, colIdx) => {
    if (chr === '#') {
      galaxySet.add(`${lineIdx}:${colIdx}`);
    }
  });
});

galaxySet.forEach((galaxy) => {
  lines.forEach((line, lineIdx) => {
    line.split('').forEach((chr, colIdx) => {
      if (chr === '#') {
        const [currLine, currCol] = galaxy.split(':');
        if (Number(currLine) === lineIdx && Number(currCol) === colIdx) {
        } else {
          if (!galaxyPairSet.has(`${lineIdx}:${colIdx}-${galaxy}`))
            galaxyPairSet.add(`${galaxy}-${lineIdx}:${colIdx}`);
        }
      }
    });
  });
});

let sum = 0;
galaxyPairSet.forEach((pair) => {
  const [g1, g2] = pair.split('-');
  const [line1, col1] = g1.split(':');
  const [line2, col2] = g2.split(':');

  let actualLine1 = Number(line1);
  let actualLine2 = Number(line2);
  emptyLines.forEach((emptyLine) => {
    if (emptyLine < Number(line1)) {
      actualLine1 += emptySpaceLength;
    }
    if (emptyLine < Number(line2)) {
      actualLine2 += emptySpaceLength;
    }
  });

  let actualCol1 = Number(col1);
  let actualCol2 = Number(col2);
  emptyCols.forEach((emptyCol) => {
    if (emptyCol < Number(col1)) {
      actualCol1 += emptySpaceLength;
    }
    if (emptyCol < Number(col2)) {
      actualCol2 += emptySpaceLength;
    }
  });

  const distance =
    Math.abs(Number(actualLine1) - Number(actualLine2)) +
    Math.abs(Number(actualCol1) - Number(actualCol2));

  sum += distance;
});

console.log(sum);
