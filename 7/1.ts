import { readFileSync } from 'fs';

const lines = readFileSync('input.txt', 'utf8').split('\n');

const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const hands: Array<string> = [];
const handsToBidMapping = new Map<string, number>([]);

lines.forEach((line) => {
  const [hand, bid] = line.split(' ');
  hands.push(hand);
  handsToBidMapping.set(hand, Number(bid));
});

type HandTypes =
  | 'fiveKind'
  | 'fourKind'
  | 'fullHouse'
  | 'threeKind'
  | 'twoPair'
  | 'onePair'
  | 'highCard';
const getHandType = (hand: string): HandTypes | 'test' => {
  const cardOccurenceMapping = new Map<string, number>();

  hand.split('').forEach((card) => {
    cardOccurenceMapping.set(card, (cardOccurenceMapping.get(card) || 0) + 1);
  });

  switch (cardOccurenceMapping.size) {
    case 1: {
      return 'fiveKind';
    }
    case 2: {
      // four kind (4,1)
      // full house (3,2)
      for (let [_, occurence] of cardOccurenceMapping) {
        if (occurence === 4) {
          return 'fourKind';
        }
        if (occurence === 3) {
          return 'fullHouse';
        }
      }
    }
    case 3: {
      // three kind (3, 1, 1)
      // two pair (2, 2, 1)
      for (let [_, occurence] of cardOccurenceMapping) {
        if (occurence === 3) {
          return 'threeKind';
        }
        if (occurence === 2) {
          return 'twoPair';
        }
      }
    }
    case 4: {
      // one pair (2, 1,1,1)
      return 'onePair';
    }
    case 5: {
      // high card
      return 'highCard';
    }
  }

  return 'highCard';
};

const handsImportanceMapping = new Map<string, number>([
  ['fiveKind', 1],
  ['fourKind', 2],
  ['fullHouse', 3],
  ['threeKind', 4],
  ['twoPair', 5],
  ['onePair', 6],
  ['highCard', 7],
]);

let winnings = 0;
hands
  .sort((first, second) => {
    const first_imp = handsImportanceMapping.get(getHandType(first));
    const second_imp = handsImportanceMapping.get(getHandType(second));

    if (first_imp && second_imp) {
      if (first_imp === second_imp) {
        for (let i = 0; i < 5; i++) {
          const _first = cards.indexOf(first[i]);
          const _second = cards.indexOf(second[i]);
          if (_first === _second) {
            continue;
          }
          if (_first < _second) {
            return 1;
          } else {
            return -1;
          }
        }
      }
      if (first_imp < second_imp) {
        return 1;
      }
      if (first_imp > second_imp) {
        return -1;
      }
    }
    return 1;
  })
  .forEach((hand, handIndex) => {
    winnings += (handIndex + 1) * (handsToBidMapping.get(hand) || 1);
  });

console.log(winnings);
