import fs from 'fs';
import { get } from 'http';

const input = fs.readFileSync('./src/d06/input.txt', 'utf8');

const timesAndDistances = input.split('\n').map((line) => {
  const [_, distance] = line.split(':');
  const numbers = distance.trim().split(/\W+/).map((n) => parseInt(n));
  return numbers;
});

const getDistance = (time: number, pressingTime: number): number => {
  const velocity = pressingTime;
  const remainingTime = time - pressingTime;
  return velocity * remainingTime;
};

const getVariations = (time: number, distance: number): number => {
  const valuesAbove = Array.from({ length: time }, (_, i) => {
    const velocity = i;
    const currentDistance = getDistance(time, velocity);
    return {distance: currentDistance, i};
  }).filter(({distance: v}) => distance < v);
  // console.log(`Values above ${JSON.stringify(valuesAbove)}`);
  console.log(`Low: ${valuesAbove[0].i}, High: ${valuesAbove[valuesAbove.length - 1].i}`);
  return valuesAbove.length;
};

const binarySearch = (lowerBound: number, upperBound: number, condition: (currentValue: number) => number): number => {
  let lower = lowerBound;
  let upper = upperBound;
  let currentValue = Math.floor((upper + lower) / 2);
  while (lower < upper) {
    const result = condition(currentValue);
    if (result === 0) {
      return currentValue;
    }
    if (result < 0) {
      lower = currentValue + 1;
    }
    if (result > 0) {
      upper = currentValue - 1;
    }
    // console.log(lower, upper);
    currentValue = Math.floor((upper + lower) / 2);
  }
  return currentValue;
};

const getVariations2 = (time: number, distance: number): number => {
  // let lowerLower = 0;
  // let upperUper = time;
  // let lowerLimit = lowerLower;
  // while (!(getDistance(time, lowerLimit) < distance && distance < getDistance(time, lowerLimit+1))) {
  //   // lowerLimit++;
  // }
  // const upperLimit = lowerLimit + 1;
  const condition1 = (currentValue: number) => {
    const lowerValue = getDistance(time, currentValue);
    const upperValue = getDistance(time, currentValue + 1);
    if (lowerValue < distance && upperValue <= distance) {
      return -1;
    }
    if (lowerValue <= distance && distance < upperValue) {
      return 0;
    }
    if (distance < lowerValue && distance < upperValue) {
      return 1
    }
    throw new Error(`C1 No condition met for ${currentValue} distance: ${distance} lower: ${lowerValue} upper: ${upperValue}`);
  };
  const lowerLimit = binarySearch(0, time, condition1);

  const condition2 = (currentValue: number) => {
    const lowerValue = getDistance(time, currentValue);
    const upperValue = getDistance(time, currentValue + 1);
    if (upperValue < distance && lowerValue <= distance) {
      return 1;
    }
    if (upperValue <= distance && distance < lowerValue) {
      return 0;
    }
    if (distance < upperValue && distance < lowerValue) {
      return -1
    }
    return 1;
  }

  const upperLimit = binarySearch(0, time, (value) => condition2(value));
  return upperLimit - lowerLimit;
};



const first = (timesAndDistances: number[][]): number => {
  const transposed = timesAndDistances[0].map((_, colIndex): [number, number] => [timesAndDistances[0][colIndex], timesAndDistances[1][colIndex]]);

  const result = transposed.reduce((acc, [time, distance]) => {
    return acc * getVariations2(time, distance);
  }, 1);

  return result;
};

const second = (timesAndDistances: number[][]): number => {
  const time = parseInt(timesAndDistances[0].map((v) => `${v}`).join(''));
  const distance = parseInt(timesAndDistances[1].map((v) => `${v}`).join(''));
  return getVariations2(time, distance);
};

console.log(second(timesAndDistances));