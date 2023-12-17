import fs from "fs";

const input = fs.readFileSync("./src/d17/input.txt", "utf8");

const parse = (input: string): number[][] =>
  input.split("\n").map((line) => line.split("").map((v) => parseInt(v)));

interface PointDirectionState {
  value: number;
  trace: string;
}
interface PointState {
  N?: PointDirectionState;
  E?: PointDirectionState;
  S?: PointDirectionState;
  W?: PointDirectionState;
}

const repeat = (n: number, s: string): string => {
  return Array.from({ length: n }, () => s).join("");
};

const traceToCorrds = (trace: string): [number, number][] => {
  const ret: [number, number][] = [[0, 0]];
  for (const char of trace) {
    const [x, y] = ret[ret.length - 1];
    switch (char) {
      case "N":
        ret.push([x, y - 1]);
        break;
      case "E":
        ret.push([x + 1, y]);
        break;
      case "S":
        ret.push([x, y + 1]);
        break;
      case "W":
        ret.push([x - 1, y]);
        break;
    }
  }
  return ret;
};

const printTrace = (map: number[][], coords: [number, number][]) => {
  const mapCopy = map.map((line) => line.map((v) => `${v}`));
  for (const [x, y] of coords) {
    mapCopy[y][x] = "▯";
  }
  console.log(mapCopy.map((line) => line.join("")).join("\n"));
};

const first = (map: number[][], low: number, high: number): number => {
  const traces: PointState[][] = map.map((line) => line.map(() => ({})));
  const fringe = new Set(["0,0"]);
  traces[0][0] = {
    S: {
      value: 0,
      trace: "",
    },
    E: {
      value: 0,
      trace: "",
    },
  };
  // const fringeMap = new Map<string, string>([["0,0,S", ""], ["0,0,E", ""]]);

  let prev = "";
  while (fringe.size > 0) {
    const firstElem = [...fringe][0];
    fringe.delete(firstElem);
    const [x, y] = firstElem.split(",").map((v) => parseInt(v));
    const state = traces[y][x];
    if (state.E !== undefined) {
      let { value, trace: currentTrace } = state.E;
      for (let i = x + 1; i < Math.min(map[y].length, x + high); i++) {
        value += map[y][i];
        if (i < x+low) {
          continue;
        }
        const currentStringified = JSON.stringify(traces[y][i]);
        traces[y][i] = {
          ...traces[y][i],
          N:
            value < (traces[y][i].N?.value ?? Infinity)
              ? {
                  value,
                  trace: currentTrace + repeat(i - x, "E"),
                }
              : traces[y][i].N,
          S:
            value < (traces[y][i].S?.value ?? Infinity)
              ? {
                  value,
                  trace: currentTrace + repeat(i - x, "E"),
                }
              : traces[y][i].S,
        };
        if (currentStringified !== JSON.stringify(traces[y][i])) {
          fringe.add(`${i},${y}`);
        }
      }
    }
    if (state.W !== undefined) {
      let { value, trace: currentTrace } = state.W;
      for (let i = x - 1; i > Math.max(-1, x - high); i--) {
        value += map[y][i];
        if (x-low < i) {
          continue;
        }
        const currentStringified = JSON.stringify(traces[y][i]);
        traces[y][i] = {
          ...traces[y][i],
          N:
            value < (traces[y][i].N?.value ?? Infinity)
              ? {
                  value,
                  trace: currentTrace + repeat(x - i, "W"),
                }
              : traces[y][i].N,
          S:
            value < (traces[y][i].S?.value ?? Infinity)
              ? {
                  value,
                  trace: currentTrace + repeat(x - i, "W"),
                }
              : traces[y][i].S,
        };
        if (currentStringified !== JSON.stringify(traces[y][i])) {
          fringe.add(`${i},${y}`);
        }
      }
    }
    if (state.N !== undefined) {
      let { value, trace: currentTrace } = state.N;
      for (let i = y - 1; i > Math.max(-1, y - high); i--) {
        value += map[i][x];
        if (y-low < i) {
          continue;
        }
        const currentStringified = JSON.stringify(traces[i][x]);
        traces[i][x] = {
          ...traces[i][x],
          E:
            value < (traces[i][x].E?.value ?? Infinity)
              ? {
                  value,
                  trace: currentTrace + repeat(y - i, "N"),
                }
              : traces[i][x].E,
          W:
            value < (traces[i][x].W?.value ?? Infinity)
              ? {
                  value,
                  trace: currentTrace + repeat(y - i, "N"),
                }
              : traces[i][x].W,
        };
        if (currentStringified !== JSON.stringify(traces[i][x])) {
          fringe.add(`${x},${i}`);
        }
      }
    }
    if (state.S !== undefined) {
      let { value, trace: currentTrace } = state.S;
      for (let i = y + 1; i < Math.min(map.length, y + high); i++) {
        value += map[i][x];
        if (i < y+low) {
          continue;
        }
        const currentStringified = JSON.stringify(traces[i][x]);
        traces[i][x] = {
          ...traces[i][x],
          E:
            value < (traces[i][x].E?.value ?? Infinity)
              ? {
                  value,
                  trace: currentTrace + repeat(i - y, "S"),
                }
              : traces[i][x].E,
          W:
            value < (traces[i][x].W?.value ?? Infinity)
              ? {
                  value,
                  trace: currentTrace + repeat(i - y, "S"),
                }
              : traces[i][x].W,
        };
        if (currentStringified !== JSON.stringify(traces[i][x])) {
          // fringeMap.set(`${x},${i}`, fringeMap.get(firstElem)! + "S");
          fringe.add(`${x},${i}`);
        }
      }
    }
    // console.log(fringe);
    // console.log(traces);
    // const lastElem = JSON.stringify(traces[map.length - 1][map[0].length - 1]);
    // if (prev !== lastElem) {
    //   console.log(lastElem);
    //   // console.log('Last elem trace', fringeMap.get(`${map[0].length - 1},${map.length - 1}`))
    //   prev = lastElem;
    // }
    // const lastElem = traces[map.length - 1][map[0].length - 1];
    // Object.values(lastElem).forEach(({ value, trace }) => {
    //   if (value === 1128) {
    //     const coords = traceToCorrds(trace);
    //     console.log("\n\n")
    //     // printTrace(map, coords);
    //     console.log(trace);

    //     console.log("\n\n")
    //   }
    // });
  }
  // console.log("Last one", traces[map.length - 1][map[0].length - 1]);
  // console.log(fringeMap)

  let min = Infinity;
  let minTrace = "";
  [...Object.values(traces[map.length - 1][map[0].length - 1])].forEach(
    ({ value, trace }) => {
      if (value < min) {
        min = value;
        minTrace = trace;
      }
    }
  );

  // const coords = traceToCorrds(minTrace);
  // console.log(minTrace);
  // printTrace(map, coords);

  return Math.min(
    ...[...Object.values(traces[map.length - 1][map[0].length - 1])].map(
      ({ value }) => value
    )
  );
};

// console.log("First part:", first(parse(input), 1, 4));
console.log('Second part:', first(parse(input), 4, 11));
