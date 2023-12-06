import { readFileSync } from 'fs';

const file = readFileSync('./input.txt', 'utf8');

const parts = file.split('\n\n');

interface IMappingInfo {
  source: number;
  destination: number;
  range: number;
}

let seeds: Array<number> = [];
const seedToSoilMapping: Array<IMappingInfo> = [];
const soilToFertilizerMapping: Array<IMappingInfo> = [];
const fertilizerToWaterMapping: Array<IMappingInfo> = [];
const waterToLightMapping: Array<IMappingInfo> = [];
const lightToTemperatureMapping: Array<IMappingInfo> = [];
const temperatureToHumidityMapping: Array<IMappingInfo> = [];
const humidityToLocationMapping: Array<IMappingInfo> = [];

const mapsMapping = new Map<number, Array<IMappingInfo>>([
  [1, seedToSoilMapping],
  [2, soilToFertilizerMapping],
  [3, fertilizerToWaterMapping],
  [4, waterToLightMapping],
  [5, lightToTemperatureMapping],
  [6, temperatureToHumidityMapping],
  [7, humidityToLocationMapping],
]);

let seedInfo: Array<number> = [];
parts.forEach((part, partIndex) => {
  // get the seeds
  if (partIndex === 0) {
    seedInfo = part
      .split(': ')[1]
      .split(' ')
      .map((str) => Number(str));

    part
      .split(': ')[1]
      .split(' ')
      .forEach((nrString) => {
        seeds.push(Number(nrString));
      });
  }

  const partInfo = part.split('\n');

  for (let i = 1; i < partInfo.length; i++) {
    // [destination , source, range]
    const infoNumbers = partInfo[i].split(' ').map((strNr) => Number(strNr));

    let mapping: Array<IMappingInfo> | undefined;

    mapping = mapsMapping.get(partIndex);

    if (mapping) {
      mapping.push({
        destination: infoNumbers[0],
        source: infoNumbers[1],
        range: infoNumbers[2],
      });
    }
  }
});

interface ISeedRange {
  start: number;
  end: number;
}
const seedRanges: Array<ISeedRange> = [];
for (let i = 0; i < seedInfo.length; i += 2) {
  const seedStart = seedInfo[i];
  const seedEnd = seedInfo[i] + seedInfo[i + 1];

  seedRanges.push({ start: seedStart, end: seedEnd });
}

seedRanges.sort((a, b) => (a.start > b.start ? 1 : -1));

const getReverseMappingValue = (
  mapping: Array<IMappingInfo>,
  source: number
) => {
  let result: number | undefined;

  mapping.forEach((info) => {
    if (result) {
      return;
    }
    if (source >= info.destination && source <= info.destination + info.range) {
      const diff = info.source - info.destination;
      result = source + diff;
    }
  });

  return result || source;
};

let maxLocation = Number.MIN_VALUE;
humidityToLocationMapping.forEach((info) => {
  if (info.destination + info.range > maxLocation) {
    maxLocation = info.destination + info.range;
  }
});
let lowestLocation: number | undefined;

for (let i = 0; i <= maxLocation; i++) {
  if (lowestLocation) {
    break;
  }
  let currentValue = i;
  for (let i = 7; i >= 1; i--) {
    const mapping = mapsMapping.get(i);
    if (mapping) {
      const val = getReverseMappingValue(mapping, currentValue);
      if (val) {
        currentValue = val;
      }
    }
  }
  seedRanges.forEach((range) => {
    if (currentValue >= range.start && currentValue <= range.end) {
      lowestLocation = i;
    }
  });
}
console.log(lowestLocation);
