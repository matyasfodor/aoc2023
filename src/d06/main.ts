import fs from 'fs';

const input = fs.readFileSync('./src/d06/input.txt', 'utf8');

const timesAndDistances = input.split('\n').map((line) => {
  const [_, distance] = line.split(':');
  const numbers = distance.trim().split(/\W+/).map((n) => parseInt(n));
  return numbers;
});

const transposed = timesAndDistances[0].map((_, colIndex): [number, number] => [timesAndDistances[0][colIndex], timesAndDistances[1][colIndex]]);

const getVariations = (time: number, distance: number): number => {
  return Array.from({ length: time }, (_, i) => {
    const velocity = i;
    const remainingTime = time - i;
    return velocity * remainingTime;
  }).filter((v) => distance < v).length;
};

const result = transposed.reduce((acc, [time, distance]) => {
  return acc * getVariations(time, distance);
}, 1);

console.log(result);