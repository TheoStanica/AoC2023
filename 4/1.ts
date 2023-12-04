import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
const lines = file.split('\n');

const getCardNumbers = (numbersString: string): Array<number> => {
  return numbersString
    .split(' ')
    .filter(Boolean)
    .map((numberString) => Number(numberString));
};

let totalScore = 0;
lines.forEach((line) => {
  const data = line.split(': ');

  const gameData = data[1].split(' | ');
  const winningNumbersSet = new Set<number>(getCardNumbers(gameData[0]));
  const cardNumbers = getCardNumbers(gameData[1]);

  let score = 0;
  cardNumbers.forEach((crdNumber) => {
    if (winningNumbersSet.has(crdNumber)) {
      score = score === 0 ? 1 : score * 2;
    }
  });

  totalScore += score;
});

console.log(totalScore);
