import fs from "fs";

const input = fs.readFileSync("./src/d09/input.txt", "utf8").split("\n");
const values = input.map((line) =>
  line
    .trim()
    .split(" ")
    .map((v) => parseInt(v, 10))
);

interface Rule {
  lineStarts: number[];
  firstLineLength: number;
}

const extractRule = (line: number[]): Rule => {
  const lineStarts: number[] = [];
  const firstLineLength = line.length;
  while (!line.every((v) => v === 0)) {
    lineStarts.push(line[0]);
    line = line.reduce((acc: number[], v, i) => {
      if (i === 0) {
        return acc;
      }
      return [...acc, line[i] - line[i - 1]];
    }, []);
  }
  return { lineStarts, firstLineLength };
};

const getNext = (rule: Rule): number => {
  const mx = Array.from({ length: rule.lineStarts.length }, (_, i) =>
    Array.from({ length: rule.firstLineLength + 1 }, (_, j) =>
      j === 0 ? rule.lineStarts[i] : 0
    )
  );
  // console.log(mx);
  for (let i = 1; i < rule.firstLineLength + 1; i++) {
    for (let j = rule.lineStarts.length-1; 0 <= j ; j--) {
      mx[j][i] = mx[j][i - 1] + (j === rule.lineStarts.length-1 ? 0 : mx[j + 1][i-1]);
    }
  }
  const newItem = mx[0].slice(-1)[0];
  console.log(newItem);
  return newItem;
};

const getPrev = (rule: Rule): number => {
  const mx = Array.from({ length: rule.lineStarts.length + 1 }, (_, i) =>
    Array.from({ length: 2 }, (_, j) =>
      j === 1 ? rule.lineStarts[i] ?? 0 : 0
    )
  );
  for (let i = mx.length - 2; 0 <= i; i--) {
    mx[i][0] = mx[i][1] - mx[i + 1][0];
  }
  return mx[0][0];
};

const first = (values: number[][]): number => {
  const rules = values.map((line) => extractRule(line));
  return rules.reduce((acc, rule) => acc + getNext(rule), 0);
};

const second = (values: number[][]): number => {
  const rules = values.map((line) => extractRule(line));
  return rules.reduce((acc, rule) => acc + getPrev(rule), 0);
}

// console.log(`First ${first(values)}`);
console.log(`Second ${second(values)}`);
