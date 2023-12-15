import { readFileSync } from 'fs';

const file = readFileSync('./input.txt', 'utf8');

const words = file.split(',');

const hash = (str: string): number => {
  let value = 0;
  str.split('').forEach((chr) => {
    const chrScore = (chr.charCodeAt(0) + value) * 17;
    value = chrScore % 256;
  });

  return value;
};

let totalScore = 0;
words.forEach((word) => {
  totalScore += hash(word);
});
console.log('result: ', totalScore);
