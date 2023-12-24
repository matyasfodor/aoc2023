import fs from "fs";

const input = fs.readFileSync("./src/d24/input.txt", "utf8").trim().split("\n");

type Coord2D = [number, number];

interface Hailstone {
  pos: Coord2D;
  veolcity: Coord2D;
}

const parseStones = (input: string[]): Hailstone[] => {
  return input.map((line) => {
    const [pos, velocity] = line.split("@");
    const [x, y, z] = pos.split(",").map((n) => parseInt(n.trim(), 10));
    const [vx, vy, vz] = velocity.split(",").map((n) => parseInt(n.trim(), 10));
    return { pos: [x, y], veolcity: [vx, vy] };
  });
};

const hailstones = parseStones(input);

const covertToAXplusB = (h: Hailstone): { a: number; b: number } => {
  const normalizedVelocity = h.veolcity[1] / h.veolcity[0];
  return { a: normalizedVelocity, b: h.pos[1] - h.pos[0] * normalizedVelocity };
};

const crosses2D = (
  h1: Hailstone,
  h2: Hailstone,
  [boundLow, boundHigh]: [number, number]
): boolean => {
  // Find crossing point
  // Bring to ax + b form
  // normalize speed such that x = 1
  const h1Norm = covertToAXplusB(h1);
  const h2Norm = covertToAXplusB(h2);
  const crossingTime = (h2Norm.b - h1Norm.b) / (h1Norm.a - h2Norm.a);
  const crossingPoint = [crossingTime, h1Norm.a * crossingTime + h1Norm.b];
  const h1Time = (crossingPoint[0] - h1.pos[0]) / h1.veolcity[0];
  const h2Time = (crossingPoint[0] - h2.pos[0]) / h2.veolcity[0];
  // console.log(`Hail ${h1} ${h2}, crossing time: ${crossingTime}, crossing point: ${crossingPoint}, h1Time: ${h1Time}, h2Time: ${h2Time}`);
  return (
    boundLow <= crossingPoint[0] &&
    crossingPoint[0] <= boundHigh &&
    boundLow <= crossingPoint[1] &&
    crossingPoint[1] <= boundHigh &&
    0 <= h1Time &&
    0 <= h2Time
  );
};

const first = (hailstones: Hailstone[]): number => {
  let ret = 0;
  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      if (crosses2D(hailstones[i], hailstones[j], [200000000000000, 400000000000000])) {
        ret++;
      }
    }
  }
  return ret;
};

console.log("First: ", first(hailstones));
