import fs from "fs";

const input = fs.readFileSync("src/d15/input.txt").toString().split(",");

const hashFunction = (input: string): number => {
  return Array.from(input).reduce(
    (acc, cur) => ((acc + cur.charCodeAt(0)) * 17) % 256,
    0
  );
};

const first = (input: string[]): number => {
  return input.reduce((acc, cur) => acc + hashFunction(cur), 0);
};

class Lens {
  constructor(public label: string, public focalLength: number) {}
}

const parse = (input: string): { label: string; op: "=" | "-"; value?: number } => {
  if (input.indexOf("=") > -1) {
    const [label, rawValue] = input.split("=");
    return {
      label,
      op: "=",
      value: parseInt(rawValue),
    }
  } else if (input.indexOf("-") > -1) {
    const [label] = input.split("-");
    return {
      label,
      op: "-",
    }
  } else {
    throw new Error(`Unknown operation ${input}`);
  }
}

const second = (input: string[]): number => {
  const finalState: Lens[][] = input.reduce(
    (acc, cur) => {
      // const [l1 ,l2, op, ...rest] = cur.split("");
      // const label = `${l1}${l2}`;
      const { label, op, value } = parse(cur);
      const box = hashFunction(label);
      if (op === '=') {
        const item = acc[box].find(lens => lens.label === label);
        if (item) {
          item.focalLength = value!;
        } else {
          acc[box].push(new Lens(label, value!));
        }
      } else if (op === '-') {
        acc[box] = acc[box].filter(lens => lens.label !== label);
      }
      return acc;
    },
    Array.from({ length: 256 }, (): Lens[] => [])
  );

  // console.log(finalState);

  return finalState.reduce(
    (acc, box, i) =>
      acc +
      (i + 1) * box.reduce((boxAcc, lens, pos) => boxAcc + (pos + 1) * lens.focalLength, 0),
    0
  );
};

// console.log(`First ${first(input)}`);
console.log(`Second ${second(input)}`);
