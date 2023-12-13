import fs from 'fs';

const input = fs.readFileSync('./src/d13/input.txt').toString().split('\n\n').map((line) => line.split('\n'));

const getLinesOverReflection = (map: string[]): number[] => {
  const ret: number[] = [];
  for (let i = 0; i < map.length; i++) {
    let reflected = true;
    let j = 0;
    while (reflected) {
      const leftIndex = i - j;
      const rightIndex = i + 1 + j;
      if (leftIndex < 0 || rightIndex >= map.length) {
        break;
      }
      if (map[leftIndex] !== map[rightIndex]) {
        reflected = false;
        break;
      }
      j++;
    }
    if (reflected && 0 < j) {
      ret.push(j + 1);
    }
  }
  if (ret.length > 1) {
    console.log('ret: ', ret);
    console.log(map);
  }
  return ret;
};

const getLinesOverReflection2 = (map: string[]): number[] => {
  const ret: number[] = [];
  for (let i = 1; i < map.length; i++) {
    const left = map.slice(0, i).reverse().join('');
    const right = map.slice(i).join('');
    const overlapLength = Math.min(left.length, right.length);
    if (left.startsWith(right.slice(0, overlapLength))) {
      ret.push(i);
    }
  }
  return ret;
};

const rotate = (map: string[]): string[] => {
  const newMap: string[] = [];
  for (let i = 0; i < map[0].length; i++) {
    const row: string[] = [];
    for (let j = 0; j < map.length; j++) {
      row.push(map[j][i]);
    }
    newMap.push(row.join(''));
  }
  return newMap;
};

const first = (input: string[][]) => {
  return input.reduce((acc, map) => {
    // assume there is only one refelction
    const colIncrement = getLinesOverReflection2(rotate(map));
    acc += colIncrement.reduce((acc, val) => acc + val, 0);
    const rowIncrement = getLinesOverReflection2(map);
    acc += rowIncrement.reduce((acc, val) => acc + 100*val, 0);
    console.log('colIncrement: ', colIncrement, 'rowIncrement: ', rowIncrement);
    return acc;
  }, 0);
};

console.log('first: ', first(input));



// console.log('Reflected', getLinesOverReflection(rotate(input[0])));
