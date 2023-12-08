import { readFileSync } from 'fs';

const input = readFileSync('./input.txt', 'utf8');
const lines = input.split('\n').filter(Boolean);

interface INode {
  left: string;
  right: string;
}

let movingSequence: string = '';
const nodesMapping = new Map<string, INode>();

lines.forEach((line, index) => {
  if (index === 0) {
    movingSequence = line;
    return;
  }
  const lineData = line.split(' = ');
  const nodeKey = lineData[0];
  const [left, right] = lineData[1].slice(1).slice(0, 8).split(', ');
  nodesMapping.set(nodeKey, { left, right });
});

let cycle = 0;
let foundZZZ = false;
let currentNodeKey = 'AAA';

do {
  if (currentNodeKey === 'ZZZ') {
    foundZZZ = true;
    break;
  }
  const node = nodesMapping.get(currentNodeKey);
  if (!node) {
    break;
  }
  const command = movingSequence[cycle % movingSequence.length];

  if (command === 'L') {
    currentNodeKey = node.left;
  } else {
    currentNodeKey = node.right;
  }

  cycle++;
} while (!foundZZZ);

console.log(cycle);
