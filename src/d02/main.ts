import fs from "fs";

const input: string = fs.readFileSync("src/d02/input.txt", "utf8");

type colors = 'blue' | 'green' | 'red';

interface Draw {
  gameValue: number;
  cubes: Map<colors, number>[];
}

const isColor = (color: string): color is colors => {
  return color === 'blue' || color === 'green' || color === 'red';
}

const parseLine = (line: string): Draw => {
  const [game, cubesRaw] = line.split(":");
  const gameValue = parseInt(game.trim().split(" ")[1]);

  const cubes = cubesRaw.split(";").map((drawSet: string): Map<colors, number> => {
    return drawSet.split(",").reduce((cubes: Map<colors, number>, cube: string) => {
      let [count, color] = cube.trim().split(" ");
      if (!isColor(color)) {
        throw new Error(`Invalid color: ${color}`);
      }
      cubes.set(color, cubes.get(color) ?? 0 + parseInt(count));
      return cubes;
    }, new Map<colors, number>());
  });

  return {
    gameValue,
    cubes,
  };
}

const maxVals = new Map<colors, number>([
  ['blue', 14],
  ['green', 13],
  ['red', 12],
]);

const possible = (draw: Draw): boolean => {
  return draw.cubes.every((drawSet: Map<colors, number>) => {
    return Array.from(drawSet.entries()).every(([color, count]) => {
      return count <= maxVals.get(color)!;
    });
  });
}

const first = (draw: Draw): number => {
  if (possible(draw)) {
    return draw.gameValue;
  }
  return 0;
};

const second = (draw: Draw): number => {
  const smallest = draw.cubes.reduce((smallest: Map<colors, number>, drawSet: Map<colors, number>) => {
    Array.from(drawSet.entries()).forEach(([color, count]) => {
      if (count > (smallest.get(color) ?? 0) ) {
        smallest.set(color, count);
      }
    });
    return smallest;
  }, new Map<colors, number>());

  const power = Array.from(smallest.values()).reduce((acc: number, curr: number) => {
    return acc * curr;
  }, 1);
  return power;
}

const sum = input.split("\n").reduce((sum: number, line: string) => {
  const draw = parseLine(line);
  sum += second(draw);
  return sum;
}, 0);

console.log(sum);