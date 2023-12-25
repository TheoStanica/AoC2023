import { readFileSync } from 'fs';

const lines = readFileSync('input.txt', 'utf8').split('\n');

const points: Array<{ i: number; j: number }> = [];

const commands = ['R', 'D', 'L', 'U'];

let currentI = 0;
let currentJ = 0;
points.push({ i: currentI, j: currentJ });
lines.forEach((line) => {
  const [_, __, color] = line.split(' ');

  const _length = parseInt(color.slice(2, color.length - 2), 16);
  const _command = color.slice(color.length - 2, color.length - 1);

  const command = commands[Number(_command)];
  const length = Number(_length);

  switch (command) {
    case 'U': {
      currentI -= length;
      break;
    }
    case 'D': {
      currentI += length;
      break;
    }
    case 'L': {
      currentJ -= length;
      break;
    }
    case 'R': {
      currentJ += length;
    }
  }

  points.push({ i: currentI, j: currentJ });
});

let area = 0;
let perimeter = 0;
for (let i = 0; i < points.length - 1; i++) {
  const first = points[i];
  const second = points[i + 1];

  area += first.i * second.j - second.i * first.j;

  perimeter += Math.sqrt(
    Math.pow(second.i - first.i, 2) + Math.pow(second.j - first.j, 2)
  );
}
area = 0.5 * Math.abs(area);

console.log('result', area + perimeter / 2 + 1);
