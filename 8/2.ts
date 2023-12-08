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

interface INodesData {
  currentNode: string;
  steps: number;
}
const startingNodesToStepsMapping = new Map<string, INodesData>();

for (let [key, _] of nodesMapping) {
  if (key[key.length - 1] === 'A') {
    startingNodesToStepsMapping.set(key, { currentNode: key, steps: 0 });
  }
}

const getPathEnd = (startingNode: string) => {
  let cycle = 0;
  let foundZZZ = false;
  let currentNodeKey = startingNode;

  do {
    if (cycle > 0 && currentNodeKey[currentNodeKey.length - 1] == 'Z') {
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

  return { cycle, node: currentNodeKey };
};

const lcmArr: Array<number> = [];
for (let [nodeKey, data] of startingNodesToStepsMapping) {
  lcmArr.push(getPathEnd(nodeKey).cycle);
}

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

console.log(lcmArr.reduce(lcm));
