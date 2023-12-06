import { readFileSync } from 'fs';

const file = readFileSync('./example.txt', 'utf8');

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

const getMappingValue = (
  mapping: Array<IMappingInfo>,
  source: number
): number => {
  let result: number | undefined;

  mapping.forEach((info) => {
    if (result) {
      return;
    }
    if (info.source <= source && info.source + info.range >= source) {
      result = info.destination + (source - info.source);
    }
  });

  return result || source;
};

parts.forEach((part, partIndex) => {
  // get the seeds
  if (partIndex === 0) {
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

let minLocation: number = Number.MAX_VALUE;

seeds.forEach((seed, seedndx) => {
  let currentValue = seed;
  for (let i = 1; i <= 7; i++) {
    const mapping = mapsMapping.get(i);
    if (mapping) {
      const val = getMappingValue(mapping, currentValue);
      if (val) {
        currentValue = val;
      }
    }
  }
  if (currentValue < minLocation) {
    minLocation = currentValue;
  }
});

console.log(minLocation);
