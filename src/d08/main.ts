import fs from "fs";

const generatePrimes = (max: number): number[] => {
  const primes: number[] = [];
  const sieve = new Array(max).fill(true);
  for (let i = 2; i < max; i++) {
    if (sieve[i]) {
      primes.push(i);
      for (let j = i * i; j < max; j += i) {
        sieve[j] = false;
      }
    }
  }
  return primes;
};

const smallesCommonMultiple = (numbers: number[]): number => {
  const max = Math.max(...numbers);
  const largestSquareRoot = Math.ceil(Math.pow(max, 0.5));
  const primedValues = new Map<number, number>(numbers.map((number) => [number, number]));
  const factors = new Map(numbers.map((number) => [number, new Map<number, number>()]));
  const primes = generatePrimes(largestSquareRoot);
  for (let prime of primes) {
    for (let number of numbers) {
      let primedValue = primedValues.get(number)!;
      if (primedValue % prime === 0) {
        let count = 0;
        while (primedValue % prime === 0) {
          primedValue /= prime;
          count++;
        }
        factors.get(number)!.set(prime, count);
        primedValues.set(number, primedValue);
      }
    }
  }
  for (let [number, primedValue] of primedValues.entries()) {
    if (primedValue !== 1) {
      factors.get(number)!.set(primedValue, 1);
    }
  }
  const smallestCommonMulitpleFactos = [...factors.values()].reduce((acc, factors) => {
    factors.forEach((count, prime) => {
      acc.set(prime, Math.max(acc.get(prime) ?? 0, count));
    });
    return acc;
  }, new Map());

  return [...smallestCommonMulitpleFactos.entries()].reduce((acc, [prime, count]) => acc * prime * count, 1);
};

class DesertMap {
  private instructions: string[];
  private graph: Map<string, [string, string]>;
  constructor(instruction: string[], graph: Map<string, [string, string]>) {
    this.instructions = instruction;
    this.graph = graph;
  }

  public static parser(input: string): DesertMap {
    const lines = input.split("\n");
    const [firstLine, _, ...rest] = lines;
    const instructions = Array.from(firstLine);
    const graph = rest.reduce((acc, line) => {
      const [leftExpr, rightExpr] = line.split("=");
      const key = leftExpr.trim();
      const [left, right] = rightExpr
        .split(",")
        .map((value) => value.replace(")", "").replace("(", "").trim());
      return acc.set(key, [left, right]);
    }, new Map<string, [string, string]>());
    return new DesertMap(instructions, graph);
  }

  public *getInstructions(): IterableIterator<string> {
    let index = 0;
    while (true) {
      yield this.instructions[index];
      index++;
      if (index >= this.instructions.length) {
        index = 0;
      }
    }
  }

  public traverse(
    startingPoint = "AAA",
    endCondition: (value: string) => boolean = (value: string) =>
      value === "ZZZ"
  ): {steps: number, path: string[]} {
    let current = startingPoint;
    let counter = 0;
    let path = [startingPoint];
    for (let instruction of this.getInstructions()) {
      counter++;
      const [left, right] = this.graph.get(current)!;
      if (instruction === "R") {
        current = right;
      } else {
        current = left;
      }
      path.push(current);
      if (endCondition(current)) {
        return {steps: counter, path};
      }
    }
    throw new Error("No path found");
  }

  public traverse2(): number {
    const startingPoints = [...this.graph.keys()].filter(
      (key) => key[key.length - 1] === "A"
    );
    const endingPoints = startingPoints.map((key) => {
      const {steps, path} = this.traverse(key, (value) => value[value.length - 1] === "Z");
      const endingPoint = path.slice(-1)[0];
      const {steps: fullCircle} = this.traverse(endingPoint, (value) => value[value.length - 1] === "Z");
      return {
        startingPoint: key,
        endingPoint: path.slice(-1)[0],
        steps,
        fullCircle,
      };
    });
    return smallesCommonMultiple(endingPoints.map(({fullCircle}) => fullCircle));
  }
}

const input = fs.readFileSync("src/d08/input.txt", "utf8");

console.log(DesertMap.parser(input).traverse2());
