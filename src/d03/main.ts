import fs from "fs";

const input: string = fs.readFileSync("src/d03/input.txt", "utf8");

const isSpecialChar = (char: string): boolean => {
  return !/[0-9\.]/.test(char);
}

const isDigit = (char: string): boolean => {
  return /[0-9]/.test(char);
}

interface Number {
  value: number;
  start: readonly [number, number];
  stop: readonly [number, number];
}

const getNumbers = (lines: string[]): Number[] => {
  const ret: Number[] = [];
  lines.forEach((line, y) => {
    for (let i=0; i<line.length; i++) {
      if (isDigit(line[i])) {
        const start = [i, y] as const;
        let val = line[i];
        while (i < line.length && isDigit(line[i])) {
          i++;
          val += line[i];
        }
        const stop = [i-1, y] as const;
        ret.push({
          value: parseInt(val),
          start,
          stop
        });
      }
    }
  });
  return ret;
}

const hasSpecialChar = (number: Number, lines: string[]): boolean => {
  for (let y=Math.max(number.start[1] - 1, 0); y<=Math.min(number.stop[1] + 1, lines.length-1); y++) {
    for (let x=Math.max(number.start[0] - 1, 0); x<=Math.min(number.stop[0] + 1, lines[0].length-1); x++) {
      if (isSpecialChar(lines[y][x])) {
        return true;
      }
    }
  }
  return false;
};

const first = (input: string): number => {
  const lines = input.split("\n");
  const numbers = getNumbers(lines);
  const sum = numbers.reduce((acc, number) => {
    if (hasSpecialChar(number, lines)) {
      acc += number.value;
    }
    return acc;
  }, 0);
  return sum;
}

const getStarsAroundNumber = (number: Number, lines: string[]): [number, number][] => {
  const ret: [number, number][] = [];
  for (let y=Math.max(number.start[1] - 1, 0); y<=Math.min(number.stop[1] + 1, lines.length-1); y++) {
    for (let x=Math.max(number.start[0] - 1, 0); x<=Math.min(number.stop[0] + 1, lines[0].length-1); x++) {
      if (lines[y][x] === "*") {
        ret.push([x, y] as [number, number]);
      }
    }
  }
  return ret;
}

const second = (input: string): number => {
  const lines = input.split("\n");
  const numbers = getNumbers(lines);

  const starMap: Map<string, Number[]> = numbers.reduce((acc, number) => {
    getStarsAroundNumber(number, lines).forEach((star) => {
      // console.log(star);
      acc.set(`${star[0]}-${star[1]}`, [...(acc.get(`${star[0]}-${star[1]}`) || []), number]);
    })
    return acc;
  }, new Map());

  // console.log(starMap);
  return Array.from(starMap.values()).reduce((acc, value) => {
    if (value.length === 2) {
      acc += value[0].value * value[1].value;
    }
    return acc;
  }, 0);
}


console.log(second(input));