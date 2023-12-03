import fs from "fs";

const input: string = fs.readFileSync("src/d01/input.txt", "utf8");
const writer = fs.createWriteStream("src/d01/output.txt");

const first = (line: string): number => {
  const numbers = Array.from(line).reduce(
    (numbers: number[], newChar: string) => {
      const parsed = parseInt(newChar);
      if (isNaN(parsed)) {
        return numbers;
      }
      numbers.push(parsed);
      return numbers;
    },
    []
  );
  const first = numbers[0];
  const last = numbers[numbers.length - 1];
  const increment = 10 * first + last;
  return increment;
};

const mapping = new Map([
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
]);

const second = (line: string): number => {
  const numbers: number[] = [];
  let index = 0;
  while (index < line.length) {
    const substring = line.substring(index);
    const parsed = parseInt(substring[0]);
    let match = false;
    if (!isNaN(parsed)) {
      numbers.push(parsed);
      index++;
      continue;
    }
    Array.from(mapping.keys()).forEach((key: string) => {
      if (substring.startsWith(key) && !match) {
        match = true;
        numbers.push(mapping.get(key)!);
        // index += key.length;
        index++;
      }
    });
    if (!match) {
      index++;
    }
  }

  writer.write(`${line} - ${numbers}\n`);

  console.log(numbers);

  const first = numbers[0];
  const last = numbers[numbers.length - 1];
  const increment = 10 * first + last;
  return increment;  
};

const sum = input.split("\n").reduce((acc: number, curr: string): number => {
  acc += second(curr);
  return acc;
}, 0);
console.log(sum);
