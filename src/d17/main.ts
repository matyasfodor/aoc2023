import fs from 'fs';

const input = fs.readFileSync('./src/d17/test.txt', 'utf8');

const parse = (input: string): number[][] =>
  input.split('\n').map((line) => line.split('').map((v) => parseInt(v)));

interface PointState {
  N?: number;
  E?: number;
  S?: number;
  W?: number;
}

const first = (map: number[][]): number => {
  const traces: PointState[][] = map.map((line) => line.map(() => ({})));
  const fringe = new Set(["0,0"]);
  traces[0][0] = {S: 0, E: 0};
  let prev = "";
  while (fringe.size > 0) {
    // console.log(traces)
    const firstElem = [...fringe][0];
    fringe.delete(firstElem);
    const [x, y] = firstElem.split(',').map((v) => parseInt(v));
    const state = traces[y][x];
    // console.log(x, y, state);
    if (state.E !== undefined) {
      let value = state.E;
      // console.log('E', value);
      for (let i = x + 1; i < Math.min(map[y].length, x + 4); i++) {
        value += map[y][i];
        if (traces[y][i].N === undefined || value < traces[y][i].N!) {
          traces[y][i].N = value;
          fringe.add(`${i},${y}`);
        }
        if (traces[y][i].S === undefined || value < traces[y][i].S!) {
          traces[y][i].S = value;
          fringe.add(`${i},${y}`);
        
        }
      }
    }
    if (state.W !== undefined) {
      let value = state.W;
      for (let i = x - 1; i >= Math.max(0, x - 4); i--) {
        value += map[y][i];
        if (traces[y][i].N === undefined || value < traces[y][i].N!) {
          traces[y][i].N = value;
          fringe.add(`${i},${y}`);
        }
        if (traces[y][i].S === undefined || value < traces[y][i].S!) {
          traces[y][i].S = value;
          fringe.add(`${i},${y}`);
        }
      }
    }
    if (state.N !== undefined) {
      let value = state.N;
      for (let i = y - 1; i >= Math.max(0, y - 4); i--) {
        value += map[i][x];
        if (traces[i][x].E === undefined || value < traces[i][x].E!) {
          traces[i][x].E = value;
          fringe.add(`${x},${i}`);
        }
        if (traces[i][x].W === undefined || value < traces[i][x].W!) {
          traces[i][x].W = value;
          fringe.add(`${x},${i}`);
        }
      }
    }
    if (state.S !== undefined) {
      let value = state.S;
      for (let i = y + 1; i < Math.min(map.length, y + 4); i++) {
        value += map[i][x];
        if(traces[i][x].E === undefined || value < traces[i][x].E!) {
          traces[i][x].E = value;
          fringe.add(`${x},${i}`);
        }
        if (traces[i][x].W === undefined || value < traces[i][x].W!) {
          traces[i][x].W = value;
          fringe.add(`${x},${i}`);
        }
      }
    }
    // console.log(fringe);
    // console.log(traces);
    const lastElem =  JSON.stringify(traces[map.length - 1][map[0].length - 1]);
    if (prev !== lastElem) {
      console.log(lastElem);
      prev = lastElem;
    }
  }
  console.log('Last one', traces[map.length - 1][map[0].length - 1]);
  return Math.min(...Object.values(traces[map.length - 1][map[0].length - 1]));
};

console.log('First part:', first(parse(input)));
// console.log('First part:', first(parse(input)));