import fs from "fs";

interface Alamanc {
  seeds: number[];
  maps: {
    from: string;
    to: string;
    rules: {
      sourceStart: number;
      destinationStart: number;
      length: number;
      shift: number;
    }[];
  }[];
}

const parse = (fname: string): Alamanc => {
  const input = fs.readFileSync(fname).toString().split("\n");

  const categories: string[][] = input.reduce(
    (
      { current, all }: { current: string[]; all: string[][] },
      line: string,
      index: number
    ) => {
      if (line === "" || index === input.length - 1) {
        all.push(current);
        current = [];
      } else {
        current.push(line);
      }
      return { current, all };
    },
    {
      current: [],
      all: [],
    }
  ).all;

  const [seedList, ...mappingLines] = categories;

  const seeds = seedList[0]
    .split(":")[1]
    .trim()
    .split(" ")
    .map((e) => parseInt(e));

  const maps = mappingLines.map((lines) => {
    const [firstLine, ...rulesLines] = lines;
    const [mapping] = firstLine.split(" ");
    const [from, _, to] = mapping.split("-");
    const rules = rulesLines.map((line) => {
      const [destinationStart, sourceStart, length] = line
        .split(" ")
        .map((e) => parseInt(e));
      return {
        sourceStart,
        destinationStart,
        length,
        shift: destinationStart - sourceStart,
      };
    }).sort((a, b) => a.sourceStart - b.sourceStart);
    return { from, to, rules };
  });

  return { seeds, maps };
};


const alamanc = parse("src/d05/input.txt");

// console.log(`Almanc ${JSON.stringify(alamanc, null, 2)}}`);

const first = (alamanc: Alamanc): number => {
  return alamanc.seeds.reduce((lowest: number, seed: number) => {
    // console.log(`### seed ${seed}`)
    const seedLocation = alamanc.maps.reduce((currentValue: number, map) => {
      let found = false;
      map.rules.forEach(({ sourceStart, length, shift }) => {
        if (
          !found &&
          sourceStart <= currentValue &&
          currentValue <= sourceStart + length
        ) {
          // console.log(`    Value: ${currentValue} matched rule: ${map.from}-${map.to}, shifts ${shift} Lower border: ${sourceStart} DestStart: ${destinationStart} Upper border: ${sourceStart + length}`);
          currentValue += shift;
          found = true;
        }
      });
      return currentValue;
    }, seed);
    // console.log(`    seedLocation: ${seedLocation}`);
    return seedLocation < lowest ? seedLocation : lowest;
  }, Infinity);
};

const rangesSum = (ranges: [number, number][]): number => {
  return ranges.reduce((sum, [from, to]) => sum + to - from, 0);
};

const second = (alamanc: Alamanc): number => {
  const pairs = Array.from(
    { length: alamanc.seeds.length / 2 },
    (_, i): [number, number] => [
      alamanc.seeds[2 * i],
      alamanc.seeds[2 * i] + alamanc.seeds[2 * i + 1],
    ]
  );

  const finalRanges = alamanc.maps.reduce((ranges: [number, number][], map) => {
    // console.log(`ranges: ${JSON.stringify(ranges)}`);
    const newRanges = ranges.flatMap(([from, to]) => {
      const originalRange: [number, number] = [from, to];
      const newRanges: [number, number][] = [];
      map.rules.forEach(({ sourceStart, destinationStart, length, shift }) => {
        const sourceEnd = sourceStart + length;
        if (from >= to) {
          return;
        }
        // There is an overlap
        if (to > sourceStart && from < sourceEnd) {
          if (from < sourceStart) {
            newRanges.push([from, sourceStart]);
            from = sourceStart;
          }
          const startOffset = from - sourceStart;
          const overlapSize = Math.min(to, sourceEnd) - from;
          // console.log(`overlapSize: ${overlapSize}, from: ${from}, to: ${to}, sourceStart: ${sourceStart}, sourceEnd: ${sourceEnd}`);
          newRanges.push([destinationStart + startOffset, destinationStart + startOffset + overlapSize]);
          from += overlapSize;
          // if (to < sourceEnd) {
          //   newRanges.push([from + shift, to + shift]);
          //   from = to;
          // }
        }
      //   if (from < to && from < sourceStart) {
      //     const increment = Math.min(sourceStart, to) - from;
      //   }
      //   if (from < to && sourceStart <= from && from <= sourceStart + length) {
      //     const increment = Math.min(sourceStart + length, to) - from;
      //     newRanges.push([destinationStart, destinationStart + increment]);
      //     from += increment;
      //   }
      });
      if (from < to) {
        newRanges.push([from, to]);
      }
      // console.log(`originalRange: ${originalRange} - ${rangesSum([originalRange])} newRanges: ${JSON.stringify(newRanges)} - rangesSum: ${rangesSum(newRanges)}`);
      return newRanges;
    });

    // console.log(`#### newRanges: ${JSON.stringify(newRanges)} - rangesSum: ${rangesSum(newRanges)}`);
    return newRanges;
  }, pairs);

  // console.log(`finalRanges: ${JSON.stringify(finalRanges)}`);
  return finalRanges.reduce((min, [from, to]) => {
    return from < min ? from : min;
  }, Infinity);
};

// Part 2:
//  - grab seed ranges
//  - cycle through all maps
//  - Map each range to a list of ranges

console.log(`lowest location: ${second(alamanc)}`);
