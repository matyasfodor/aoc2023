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


const alamanc = parse("src/d05/test.txt");

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

const second = (alamanc: Alamanc): number => {
  const pairs = Array.from(
    { length: alamanc.seeds.length / 2 },
    (_, i): [number, number] => [
      alamanc.seeds[2 * i],
      alamanc.seeds[2 * i] + alamanc.seeds[2 * i + 1],
    ]
  );

  const finalRanges = alamanc.maps.reduce((ranges: [number, number][], map) => {
    return ranges.flatMap(([from, to]) => {
      const newRanges: [number, number][] = [];
      map.rules.forEach(({ sourceStart, destinationStart, length, shift }) => {
        if (from < to && from < sourceStart) {
          const increment = Math.min(sourceStart, to) - from;
        }
        if (from < to && sourceStart <= from && from <= sourceStart + length) {
          const increment = Math.min(sourceStart + length, to) - from;
          newRanges.push([destinationStart, destinationStart + increment]);
          from += increment;
        }
      });
      return newRanges;
    });
  }, pairs);

  console.log(`finalRanges: ${finalRanges}`);
  return finalRanges.reduce((min, [from, to]) => {
    return from < min ? from : min;
  }, Infinity);
};

// Part 2:
//  - grab seed ranges
//  - cycle through all maps
//  - Map each range to a list of ranges

console.log(`lowest location: ${second(alamanc)}`);
