import fs from "fs";

const input: string = fs.readFileSync("src/d04/input.txt", "utf8");

const matches = input.split("\n").map((line) => {
  const [title, game] = line.split(":");
  const [winning, numbers] = game.trim().split("|");

  const winningNumbers = winning.trim().split(/\W+/);
  const numbersSet = new Set(numbers.trim().split(/\W+/));

  const matches = winningNumbers.reduce((acc, number) => {
    if (numbersSet.has(number)) {
      acc += 1;
    }
    return acc;
  }, 0);

  return matches;
});

const first = (matches: number[]): number => {
  return matches.reduce((acc, match) => {
    const increment = match > 0 ? Math.pow(2, match - 1) : 0;
    acc += increment;
    return acc;
  }, 0);
};

const second = (matches: number[]): number => {
  const cards = matches.reduce((acc, match, index) => {
    // const increment = match > 0 ? Math.pow(2, match - 1) : 0;
    // acc += increment;
    const current = acc.get(index) ?? 0;
    for (let i = index + 1; i < Math.min(index + match + 1, matches.length); i++) {
      const prevVal = acc.get(i) ?? 0;
      acc.set(i, prevVal + current * 1);
    }
    return acc;
  }, new Map<number, number>(matches.map((_, index) => [index, 1])));

  return [...cards.values()].reduce((acc, value) => acc+=value, 0);
}

console.log(second(matches));
