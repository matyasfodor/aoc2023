import fs from "fs";

const input: string = fs.readFileSync("./src/d07/input.txt", "utf8");
const lines: { hand: string; bid: number }[] = input
  .split("\n")
  .map((line: string) => {
    const [hand, bidRaw] = line.split(" ");
    return { hand, bid: parseInt(bidRaw) };
  });

const grouper = (hand: string): Map<string, number> => {
  return Array.from(hand).reduce((acc, letter) => {
    acc.set(letter, (acc.get(letter) || 0) + 1);
    return acc;
  }, new Map());
};

const cardStrengths = new Map<string, number>([
  "A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"
].reverse().map((v, index) => [v, index + 1]));

const sorter = (a: { hand: string; bid: number }, b: { hand: string; bid: number }) => {
  const aMap = grouper(a.hand);
  const bMap = grouper(b.hand);
  const aSortedTypes = [...aMap.values()].sort().reverse();
  const bSortedTypes = [...bMap.values()].sort().reverse();
  for (let i = 0; i < Math.max(aSortedTypes.length, bSortedTypes.length); i++) {
    const aType = aSortedTypes[i] ?? 0;
    const bType = bSortedTypes[i] ?? 0;
    if (aType > bType) {
      // console.log(a.hand, b.hand, "types", -1, aSortedTypes, bSortedTypes);
      return 1;
    }
    if (aType < bType) {
      // console.log(a.hand, b.hand, "types", 1, aSortedTypes, bSortedTypes);
      return -1;
    }
  }
  // const aMax = Math.max(...aMap.values());
  // const bMax = Math.max(...bMap.values());
  // if (aMax > bMax) {
  //   return 1;
  // }
  // if (aMax < bMax) {
  //   return -1;
  // }

  for (let i = 0; i < a.hand.length; i++) {
    const aCard = a.hand[i];
    const bCard = b.hand[i];
    const aStrength = cardStrengths.get(aCard)!;
    const bStrength = cardStrengths.get(bCard)!;
    if (aStrength > bStrength) {
      // console.log(a.hand, b.hand, "strength", 1, `${aCard} > ${bCard}`);
      return 1;
    }
    if (aStrength < bStrength) {
      // console.log(a.hand, b.hand, "strength", -1, `${aCard} < ${bCard}`);
      return -1;
    }
  }
  // console.log(a.hand, b.hand, "WTF");

  return 0;
};

const sortedLines = lines.sort(sorter);
// console.log(sortedLines);
const winnings = sortedLines.reduce((acc, line, index) => {
  return acc + line.bid * (index + 1);
}, 0);
console.log(winnings);
