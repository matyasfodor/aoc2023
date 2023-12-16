import fs from "fs";

const input = fs.readFileSync("./src/d16/input.txt", "utf8");

const parse = (input: string): string[][] =>
  input.split("\n").map((line) => line.split(""));

type Direction = "N" | "E" | "S" | "W";

interface Beam {
  x: number;
  y: number;
  direction: Direction;
}

const leftTurn: Record<Direction, Direction> = {
  W: "N",
  N: "E",
  E: "S",
  S: "W",
};

const rightTurn: Record<Direction, Direction> = {
  W: "S",
  S: "E",
  E: "N",
  N: "W",
};

const getNewBeams = (beam: Beam, map: string[][]): Beam[] => {
  const newCoords = {
    x: beam.x + (beam.direction === "E" ? 1 : beam.direction === "W" ? -1 : 0),
    y: beam.y + (beam.direction === "N" ? -1 : beam.direction === "S" ? 1 : 0),
  };
  if (
    newCoords.x < 0 ||
    newCoords.x >= map[0].length ||
    newCoords.y < 0 ||
    newCoords.y >= map.length
  ) {
    return [];
  }
  if (
    ["N", "S"].includes(beam.direction) &&
    map[newCoords.y][newCoords.x] === "-"
  ) {
    return [
      { ...newCoords, direction: "E" },
      { ...newCoords, direction: "W" },
    ];
  }
  if (
    ["E", "W"].includes(beam.direction) &&
    map[newCoords.y][newCoords.x] === "|"
  ) {
    return [
      { ...newCoords, direction: "N" },
      { ...newCoords, direction: "S" },
    ];
  }
  if (map[newCoords.y][newCoords.x] === "/") {
    // console.log(`char / newCoords ${newCoords.x} ${newCoords.y} ${beam.direction} LeftTurn ${leftTurn[beam.direction]}`);
    return [
      {
        ...newCoords,
        direction: ["N", "S"].includes(beam.direction)
          ? leftTurn[beam.direction]
          : rightTurn[beam.direction],
      },
    ];
  }
  if (map[newCoords.y][newCoords.x] === "\\") {
    return [
      {
        ...newCoords,
        direction: ["N", "S"].includes(beam.direction)
          ? rightTurn[beam.direction]
          : leftTurn[beam.direction],
      },
    ];
  }
  return [{ ...beam, ...newCoords }];
};

const dispCover = (
  map: string[][],
  covered: Record<Direction, boolean>[][]
): void => {
  const coveredMap = map.map((line, y) =>
    line.map((cell, x) =>
      covered[y][x].E || covered[y][x].W || covered[y][x].N || covered[y][x].S
        ? "X"
        : cell
    )
  );
  console.log(coveredMap.map((line) => line.join("")).join("\n"));
};

const getCover = (map: string[][], startingPosition: Beam): boolean[][] => {
  const covered: Record<Direction, boolean>[][] = map.map((line) =>
    line.map(() => ({
      N: false,
      E: false,
      S: false,
      W: false,
    }))
  );
  // getNewBeams({ x: 0, y: 0, direction: "E" }, map);
  let beams: Beam[] = [startingPosition];
  while (beams.length > 0) {
    // console.log('### beams', beams);
    const newBeams: Beam[] = [];
    beams.forEach((beam) => {
      const newBeamsForBeam: Beam[] = getNewBeams(beam, map).filter(
        ({ x, y, direction }) => !covered[y][x][direction]
      );;
      newBeams.push(...newBeamsForBeam);
    });
    // console.log('### newBeams', newBeams);
    newBeams.forEach(({ x, y, direction }) => {
      covered[y][x][direction] = true;
    });
    beams = newBeams;
    // dispCover(map, covered);
  }

  return covered.map((line) =>
    line.map((cell) => cell.N || cell.S || cell.E || cell.W)
  );
};

const getCoverSize = (covered: boolean[][]): number => covered.reduce(
  (sum, line) => sum + line.filter((cell) => cell).length,
  0
);

const first = (input: string): number => {
  const map = parse(input);
  const covered = getCover(map, { x: -1, y: 0, direction: "E" });
  return getCoverSize(covered);
};

const second = (input: string): number => {
  const map = parse(input);
  const startingPositions: Beam[] = [
    ...Array.from({length: map.length}, (_, i): Beam => ({
      x: -1,
      y: i,
      direction: "E"
    })),
    ...Array.from({length: map[0].length}, (_, i): Beam => ({
      x: i,
      y: -1,
      direction: "S"
    })),
    ...Array.from({length: map.length}, (_, i): Beam => ({
      x: map[0].length,
      y: i,
      direction: "W"
    })),
    ...Array.from({length: map[0].length}, (_, i): Beam => ({
      x: i,
      y: map.length,
      direction: "N"
    })),
  ];

  // const covered = getCover(map);
  return Math.max(...startingPositions.map((position) => getCoverSize(getCover(map, position))));
};

// console.log("First", first(input));
console.log("Second", second(input));
