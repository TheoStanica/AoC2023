/// NOTE!
/// to run the code:
/// - compile the code to js using 'tsc 2.ts'
/// - run 'node --stack-size=10000  2.js'

import { readFileSync } from 'fs';

const file = readFileSync('./input.txt', 'utf8');

const maze: Array<Array<string>> = [];

file.split('\n').forEach((line) => {
  maze.push(line.split(''));
});

interface IRayData {
  north?: boolean;
  south?: boolean;
  east?: boolean;
  west?: boolean;
}
const rayMap = new Map<string, IRayData>();

interface IMirrorData {
  [key: string]: Direction;
}
const mirrorMap = new Map<string, IMirrorData>([
  [
    '1', // \
    {
      west: 'north',
      south: 'east',
      north: 'west',
      east: 'south',
    },
  ],
  [
    '2', // /
    {
      west: 'south',
      north: 'east',
      east: 'north',
      south: 'west',
    },
  ],
]);

type Direction = 'north' | 'south' | 'east' | 'west';

const getNextElement = (i: number, j: number, direction: Direction) => {
  let nextI = i;
  let nextJ = j;

  switch (direction) {
    case 'north': {
      nextI--;
      break;
    }
    case 'south': {
      nextI++;
      break;
    }
    case 'east': {
      nextJ++;
      break;
    }
    case 'west': {
      nextJ--;
      break;
    }
  }

  return [nextI, nextJ];
};

const getPositionNextRays = (
  i: number,
  j: number,
  dir: Direction
): Array<Direction> => {
  const nextDir: Array<Direction> = [];

  const element = maze[i][j];

  if (element === '.') {
    return [dir];
  }

  if (element === '-') {
    if (dir === 'east' || dir === 'west') {
      nextDir.push(dir);
    } else {
      nextDir.push('east');
      nextDir.push('west');
    }
    return nextDir;
  } else if (element === '|') {
    if (dir === 'north' || dir === 'south') {
      nextDir.push(dir);
    } else {
      nextDir.push('north');
      nextDir.push('south');
    }
    return nextDir;
  } else {
    let data = undefined;
    if (element === '/') {
      data = mirrorMap.get(`2`)!;
    } else {
      data = mirrorMap.get(`1`)!;
    }
    nextDir.push(data[dir]);
  }

  return nextDir;
};

const continueRay = (i: number, j: number, direction: Direction) => {
  const [nextI, nextJ] = getNextElement(i, j, direction);

  const rayData = rayMap.get(`${i}-${j}`);
  if (!rayData) {
    rayMap.set(`${i}-${j}`, { [direction]: true });
  } else {
    if (rayData[direction]) {
      // it's a loop
      return;
    }
    rayMap.set(`${i}-${j}`, { ...rayData, [direction]: true });
  }

  if (nextI < 0 || nextI >= maze.length || nextJ < 0 || nextJ >= maze.length) {
    // out of bounds
    return;
  }

  const nextDir = getPositionNextRays(nextI, nextJ, direction);

  nextDir.forEach((_dir) => {
    continueRay(nextI, nextJ, _dir);
  });
};

let maxEnergy = Number.MIN_VALUE;

for (let j = 0; j < maze.length; j++) {
  rayMap.clear();
  continueRay(-1, j, 'south');
  if (rayMap.size - 1 > maxEnergy) {
    maxEnergy = rayMap.size - 1;
  }

  rayMap.clear();
  continueRay(maze.length, j, 'north');
  if (rayMap.size - 1 > maxEnergy) {
    maxEnergy = rayMap.size - 1;
  }
}

for (let i = 0; i < maze.length; i++) {
  rayMap.clear();
  continueRay(i, -1, 'east');
  if (rayMap.size - 1 > maxEnergy) {
    maxEnergy = rayMap.size - 1;
  }

  rayMap.clear();
  continueRay(i, maze.length, 'west');
  if (rayMap.size - 1 > maxEnergy) {
    maxEnergy = rayMap.size - 1;
  }
}

console.log(maxEnergy);
