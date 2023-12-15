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

const boxMap = new Map<number, Array<{ label: string; focal: number }>>();

words.forEach((word) => {
  let label = '';
  let focal = 0;
  let command: '-' | '=' | undefined;
  let box = -1;

  if (word.indexOf('-') !== -1) {
    command = '-';
  } else if (word.indexOf('=') !== -1) {
    command = '=';
  }
  const [_label, _focal] = word.split(`${command}`);
  label = _label;
  focal = Number(_focal);
  box = Number(hash(label));

  if (command === '=') {
    const data = boxMap.get(box);
    if (!data) {
      boxMap.set(box, [{ label, focal }]);
    } else {
      let index = -1;
      data.forEach((item, _index) => {
        if (item.label === label) {
          index = _index;
        }
      });
      if (index !== -1) {
        const updated = [
          ...data.slice(0, index),
          { label, focal },
          ...data.slice(index + 1),
        ];
        boxMap.set(box, updated);
      } else {
        boxMap.set(box, [...boxMap.get(box)!, { label, focal }]);
      }
    }
  }
  if (command === '-') {
    const data = boxMap.get(box);
    if (data) {
      let index = -1;
      data.forEach((item, _index) => {
        if (item.label === label) {
          index = _index;
        }
      });
      if (index !== -1) {
        const updated = [...data.slice(0, index), ...data.slice(index + 1)];
        boxMap.set(box, updated);
      }
    }
  }
});

let totalScore = 0;
for (let [key, value] of boxMap) {
  value.forEach((item, index) => {
    totalScore += (key + 1) * (index + 1) * item.focal;
  });
}

console.log(totalScore);
