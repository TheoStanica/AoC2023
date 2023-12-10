import { readFileSync } from 'fs';

const lines = readFileSync('./input.txt', 'utf8').split('\n');

interface INode {
  value: Pipe | 'S';
  north?: Pipe | 'S';
  south?: Pipe | 'S';
  east?: Pipe | 'S';
  west?: Pipe | 'S';
}

const mazeNodesMapping = new Map<string, INode>();

let startingLine = 0;
let startingCol = 0;
lines.forEach((line, index) => {
  line.split('').forEach((_chr, chrIdx) => {
    const chr = _chr as Pipe | 'S' | '.';
    if (chr === '.') {
      return;
    }
    if (chr === 'S') {
      startingLine = index;
      startingCol = chrIdx;
    }

    mazeNodesMapping.set(`${index}-${chrIdx}`, { value: chr });

    if (chrIdx !== 0) {
      const westNode = mazeNodesMapping.get(`${index}-${chrIdx - 1}`);
      if (westNode) {
        // add west (and east linking)
        mazeNodesMapping.set(`${index}-${chrIdx - 1}`, {
          ...westNode,
          east: chr,
        });
        const westNodeData = mazeNodesMapping.get(`${index}-${chrIdx - 1}`);
        const currentNodeData = mazeNodesMapping.get(`${index}-${chrIdx}`);
        mazeNodesMapping.set(`${index}-${chrIdx}`, {
          ...currentNodeData!,
          west: westNodeData!.value,
        });
      }
    }
    if (index !== 0) {
      const northNode = mazeNodesMapping.get(`${index - 1}-${chrIdx}`);
      if (northNode) {
        // add north (and south linking)
        mazeNodesMapping.set(`${index - 1}-${chrIdx}`, {
          ...northNode,
          south: chr,
        });

        const northNodeData = mazeNodesMapping.get(`${index - 1}-${chrIdx}`);
        const currentNodeData = mazeNodesMapping.get(`${index}-${chrIdx}`);
        mazeNodesMapping.set(`${index}-${chrIdx}`, {
          ...currentNodeData!,
          north: northNodeData!.value,
        });
      }
    }
  });
});

console.log(startingLine, startingCol);

type Direction = 'north' | 'south' | 'east' | 'west';
const getNextCommand = (
  line: number,
  col: number,
  previous: Direction
): Direction => {
  const node = mazeNodesMapping.get(`${line}-${col}`)!;
  const _node = { ...node };

  let propToRemove: Direction | undefined = undefined;

  const connectingPipes = getConnectingPipes(line, col);

  switch (previous) {
    case 'east':
      propToRemove = 'west';
      break;
    case 'west':
      propToRemove = 'east';
      break;
    case 'north':
      propToRemove = 'south';
      break;
    case 'south':
      propToRemove = 'north';
      break;
  }

  return connectingPipes.filter((p) => p !== propToRemove)[0];
};

type Pipe = '|' | '-' | '7' | 'J' | 'L' | 'F';

const eastConnections: Array<Pipe | 'S'> = ['-', '7', 'J'];
const westConnections: Array<Pipe | 'S'> = ['-', 'L', 'F'];
const northConnections: Array<Pipe | 'S'> = ['|', 'F', '7'];
const southConnections: Array<Pipe | 'S'> = ['|', 'L', 'J'];

const getValidConnectionsArray = (direction: Direction) => {
  switch (direction) {
    case 'east':
      return eastConnections;
    case 'west':
      return westConnections;
    case 'north':
      return northConnections;
    case 'south':
      return southConnections;
  }
};

const connectingPipesMap = new Map<Pipe | 'S', Array<Direction>>([
  ['S', ['north', 'south', 'east', 'west']],
  ['-', ['east', 'west']],
  ['|', ['north', 'south']],
  ['L', ['north', 'east']],
  ['F', ['south', 'east']],
  ['7', ['south', 'west']],
  ['J', ['north', 'west']],
]);

// - | L F 7 J
const getConnectingPipes = (line: number, col: number): Array<Direction> => {
  const node = mazeNodesMapping.get(`${line}-${col}`)!;

  const connectingPipesSet = new Set<Direction>();

  const { value, ...coords } = node;

  Object.keys(coords).forEach((coord) => {
    if (connectingPipesMap.get(value)?.indexOf(coord as Direction) != -1) {
      if (value === 'S') {
        const validPipesArr = getValidConnectionsArray(coord as Direction);

        if (validPipesArr.indexOf(node[coord as Direction]!) !== -1) {
          console.log('adding', coord, validPipesArr);
          connectingPipesSet.add(coord as Direction);
        }
      } else {
        connectingPipesSet.add(coord as Direction);
      }
    }
  });

  return Array.from(connectingPipesSet);
};

const stepsMapping = new Map<
  number,
  { node: string; command: Direction | undefined }
>();

let currentCommand = getConnectingPipes(startingLine, startingCol)[0];

let [currentLine, currentCol] = [startingLine, startingCol];
let step = 0;

while (1) {
  const node = mazeNodesMapping.get(`${currentLine}-${currentCol}`)!;

  if (stepsMapping.size > 0 && node.value === 'S') {
    break;
  }

  currentCommand = getNextCommand(currentLine, currentCol, currentCommand);

  stepsMapping.set(step, { node: node.value, command: currentCommand });

  if (currentCommand === 'east') {
    currentCol++;
  }
  if (currentCommand === 'west') {
    currentCol--;
  }
  if (currentCommand === 'north') {
    currentLine--;
  }
  if (currentCommand === 'south') {
    currentLine++;
  }

  step++;
}

console.log(stepsMapping.size / 2);
