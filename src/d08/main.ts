import fs from 'fs';

class DesertMap {
  private instructions: string[];
  private graph: Map<string, [string, string]>;
  constructor(instruction: string[], graph: Map<string, [string, string]>) {
    this.instructions = instruction;
    this.graph = graph;
  }

  public static parser(input: string): DesertMap {
    const lines = input.split('\n');
    // const map = lines.map(line => line.split(''));
    const [firstLine, _, ...rest] = lines;
    const instructions = Array.from(firstLine);
    const graph = rest.reduce((acc, line) => {
      // const [parent, child] = line.split(')');
      // return acc.set(child, [parent, child]);
      const [leftExpr, rightExpr] = line.split('=');
      const key = leftExpr.trim();
      const [left, right] = rightExpr.split(',').map((value) => value.replace(')', '').replace('(', '').trim())
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

  public traverse(): number {
    let current = 'AAA';
    let counter = 0;
    for (let instruction of this.getInstructions()) {
      counter++;
      const [left, right] = this.graph.get(current)!;
      if (instruction === 'R') {
        current = right;
      } else {
        current = left;
      }
      // console.log(`Current: ${current}, left: ${left}, right: ${right}, instruction: ${instruction}`);
      if (current === 'ZZZ') {
        return counter;
      }
    }
    throw new Error('No path found');
  }
}

const input = fs.readFileSync('src/d08/input.txt', 'utf8');

console.log(DesertMap.parser(input).traverse());