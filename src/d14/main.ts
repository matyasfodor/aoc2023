import fs from "fs";

const input = fs
  .readFileSync("./src/d14/input.txt")
  .toString()
  .split("\n")
  .map((line) => line.split(""));

const cycles = 1_000_000_000;

const tiltNorth = (input: string[][]): string[][] => {
  const ret: string[][] = [...input.map((line) => [...line])];
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < ret.length - 1; i++) {
      for (let j = 0; j < ret[i].length; j++) {
        if (ret[i + 1][j] === "O" && ret[i][j] === ".") {
          ret[i + 1][j] = ".";
          ret[i][j] = "O";
          changed = true;
        }
      }
    }
  }
  return ret;
};

const tilt = (
  input: string[][],
  direction: "N" | "S" | "W" | "E"
): string[][] => {
  const ret: string[][] = [...input.map((line) => [...line])];
  let changed = true;
  while (changed) {
    changed = false;
    if (direction === "N" || direction === "S") {
      const [upper, lower] =  direction === "N" ? ["O", "."] : [".", "O"];
      for (let i = 0; i < ret.length - 1; i++) {
        for (let j = 0; j < ret[i].length; j++) {
          if (ret[i + 1][j] === upper && ret[i][j] === lower) {
            ret[i + 1][j] = lower;
            ret[i][j] = upper;
            changed = true;
          }
        }
      }
    } else {
      const [upper, lower] =  direction === "W" ? ["O", "."] : [".", "O"];
      for (let i = 0; i < ret[0].length - 1; i++) {
        for (let j = 0; j < ret.length; j++) {
          if (ret[j][i + 1] === upper && ret[j][i] === lower) {
            ret[j][i+1] = lower;
            ret[j][i] = upper;
            changed = true;
          }
        }
      }
    }
  }
  return ret;
};

const getNorthLoad = (input: string[][]): number => {
  return input.reduce(
    (acc, line, index) =>
      (acc += (input.length - index) * line.filter((v) => v === "O").length),
    0
  );
};

const first = (input: string[][]): number => {
  const tilted = tilt(input, 'N');
  const load = getNorthLoad(tilted);
  return load;
};

const cycle = (input: string[][]): string[][] => {
  return (["N", "W", "S", "E"] as const).reduce((acc, direction) => tilt(acc, direction), input);
}

const getInputHash = (input: string[][]): string => input.map((line) => line.join("")).join("\n");

const second = (input: string[][]): number => {
  const cache = new Map<string, number>();
  for (let i = 0; i < cycles; i++) {
    input = cycle(input);
    const inputStr = getInputHash(input);
    if (cache.has(inputStr)) {
      const cycleLength = i - cache.get(inputStr)!;
      const cycleNumber = Math.floor((cycles - i - 1) / cycleLength);
      i += cycleNumber * cycleLength;
    } else {
      cache.set(inputStr, i);
    }
    console.log(`Cycle ${i} done northLoad: ${getNorthLoad(input)}`);
  }
  return getNorthLoad(input);
};

console.log("Second: ", second(input));
