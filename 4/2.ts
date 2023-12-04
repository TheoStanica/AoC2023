import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
const lines = file.split('\n');

const getCardNumbers = (numbersString: string): Array<number> => {
  return numbersString
    .split(' ')
    .filter(Boolean)
    .map((numberString) => Number(numberString));
};

const cardNumberOccurenceMap = new Map<number, number>([]);

lines.forEach((line, lineIndex) => {
  const data = line.split(': ');
  const cardNumber = Number(data[0].split('Card ')[1]);

  const gameData = data[1].split(' | ');
  const winningNumbersSet = new Set<number>(getCardNumbers(gameData[0]));
  const cardNumbers = getCardNumbers(gameData[1]);

  // add its own
  cardNumberOccurenceMap.set(
    cardNumber,
    (cardNumberOccurenceMap.get(cardNumber) || 0) + 1
  );

  let score = 0;
  cardNumbers.forEach((crdNumber) => {
    if (winningNumbersSet.has(crdNumber)) {
      score++;
    }
  });

  for (let i = 1; i <= score; i++) {
    cardNumberOccurenceMap.set(
      cardNumber + i,
      (cardNumberOccurenceMap.get(cardNumber + i) || 0) +
        (cardNumberOccurenceMap.get(cardNumber) || 0)
    );
  }
});

let totalScore = 0;

cardNumberOccurenceMap.forEach((value) => {
  totalScore += value;
});

console.log(totalScore);
