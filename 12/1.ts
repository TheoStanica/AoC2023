import { readFileSync } from 'fs';

const lines = readFileSync('input.txt', 'utf8').split('\n');

const lenghtsToPatterns = new Map<string, Array<string>>();
const patternsArrangements = new Map<string, number>();

let max = Number.MIN_VALUE;
lines.forEach((line) => {
  const [pattern, lenghts] = line.split(' ');
  const lengthsToPattern = lenghtsToPatterns.get(lenghts);

  patternsArrangements.set(pattern, 0);

  if (!lengthsToPattern) {
    lenghtsToPatterns.set(lenghts, [pattern]);
  } else {
    lenghtsToPatterns.set(lenghts, [...lengthsToPattern, pattern]);
  }

  if (pattern.length > max) {
    max = pattern.length;
  }
});

const decimalToStringPattern = (decimalNumber: number, digits?: number) => {
  const binaryString = decimalNumber.toString(2);
  const leadingDots = digits ? Math.max(digits - binaryString.length, 0) : 0;

  const convertedString =
    '.'.repeat(leadingDots) +
    binaryString.replace(/0/g, '.').replace(/1/g, '#');

  return convertedString;
};

const countHashSequences = (inputString: string): number[] => {
  const sequenceLengths: number[] = [];
  let currentSequenceLength = 0;

  for (const char of inputString) {
    if (char === '#') {
      currentSequenceLength++;
    } else if (currentSequenceLength > 0) {
      sequenceLengths.push(currentSequenceLength);
      currentSequenceLength = 0;
    }
  }

  if (currentSequenceLength > 0) {
    sequenceLengths.push(currentSequenceLength);
  }

  return sequenceLengths;
};

const matchPattern = (inputString: string, pattern: string): boolean => {
  if (inputString.length !== pattern.length) {
    return false;
  }

  for (let i = 0; i < inputString.length; i++) {
    const inputChar = inputString[i];
    const patternChar = pattern[i];

    if (patternChar !== '?' && inputChar !== patternChar) {
      return false;
    }
  }

  return true;
};

let arrangements = 0;
for (let i = 0; i <= Math.pow(2, max + 1) - 1; i++) {
  const pattern = decimalToStringPattern(i);

  const lenght = countHashSequences(pattern).join(',');

  const _patterns = lenghtsToPatterns.get(lenght);

  if (_patterns !== undefined) {
    _patterns.forEach((_pattern) => {
      const inputPattern = decimalToStringPattern(i, _pattern.length);
      if (matchPattern(inputPattern, _pattern)) {
        arrangements++;
      }
    });
  }
}

console.log(arrangements);
