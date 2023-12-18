import fs from 'fs';

const input = fs.readFileSync('src/d18/input.txt', 'utf8').toString().split('\n');

const floodFill = (map: string[][], startX: number, startY: number) => {
  map = map.map((row) => [...row]);
  let fringe: [number, number][] = [[startY, startX]];
  while (fringe.length > 0) {
    const [x, y] = fringe.pop()!;
    if (map[y][x] === '.') {
      map[y][x] = 'x';
      [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ].forEach(([dx, dy]) => {
        if (map[y + dy][x + dx] === '.') {
          fringe.push([x + dx, y + dy]);
        }
      });
    }
  }
  // fs.writeFileSync(`src/d18/map-${startX}-${startY}.txt`, map.map((row) => row.join('')).join('\n'))
  // console.log('\n----------------\n')
  return map.reduce((acc, row) => acc + row.reduce((rowAcc, char) => (char === 'x' ? 1 : 0) + rowAcc, 0), 0);
}

const first = (input: string[]): number => {
  let x = 0;
  let y = 0;

  let minX = 0;
  let minY = 0;

  for (let instruction of input) {
    const [direction, stepsRaw, rgb] = instruction.split(' ');
    const steps = parseInt(stepsRaw);
    for (let i = 0; i < steps; i++) {
      if (direction === 'R') {
        x++;
      } else if (direction === 'L') {
        x--;
      } else if (direction === 'U') {
        y--;
      } else if (direction === 'D') {
        y++;
      }
    }
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
  }


  x = -minX;
  y = -minY;
  let map: string[][] = Array.from({ length: y + 1 }, () => Array.from({ length: x + 1 }, () => '.'));
  map[y][x] = 'x';
  // fs.writeFileSync(`src/d18/map-starting.txt`, map.map((row) => row.join('')).join('\n'));


  let maxRowLength = x + 1;
  for (let instruction of input) {
    const [direction, stepsRaw, rgb] = instruction.split(' ');
    const steps = parseInt(stepsRaw);
    for (let i = 0; i < steps; i++) {
      if (direction === 'R') {
        x++;
      } else if (direction === 'L') {
        x--;
      } else if (direction === 'U') {
        y--;
      } else if (direction === 'D') {
        y++;
      }
      if (map[y] === undefined) {
        map[y] = Array.from({ length: maxRowLength }, () => '.');
      }
      if (x > maxRowLength) {
        maxRowLength = x;
        map = map.map((row) => {
          while (row.length <= x) {
            row.push('.');
          }
          return row;
        });
        maxRowLength = x;
      }
      // try {
      // if (map[y][x] === undefined) {
      //   map[y][x] = '.';
      // }
      // } catch {
      //   console.log(map.map((row) => row.join('')).join('\n'));
      // }

      map[y][x] = 'x';
    }

  }
  // fs.writeFileSync(`src/d18/map-prefill.txt`, map.map((row) => row.join('')).join('\n'));

  // console.log(map.map((row) => row.join('')).join('\n'));

  // Floodfill
  // let fringe: [number, number][] = [[-minY - 1, -minX + 1]];
  // while (fringe.length > 0) {
  //   const [x, y] = fringe.pop()!;
  //   if (map[y][x] === '.') {
  //     map[y][x] = 'x';
  //     [
  //       [1, 0],
  //       [0, 1],
  //       [-1, 0],
  //       [0, -1],
  //     ].forEach(([dx, dy]) => {
  //       if (map[y + dy][x + dx] === '.') {
  //         fringe.push([x + dx, y + dy]);
  //       }
  //     });
  //   }
  // }
  let ret = 0;
  [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ].forEach(([dx, dy]) => {
    try {
      const res = floodFill(map, -minY + dy, -minX + dx);
      // console.log('Res:', res);
      ret = res > ret ? res : ret;
    } catch {}
  })
  return ret;
};

console.log('First', first(input));