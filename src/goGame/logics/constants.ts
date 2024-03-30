import { isOnBoard, flatten, unflatten } from "./utils";

function getValidNeighbors(fc: number): number[] {
  const [x, y] = unflatten(fc);
  const possibleNeighbors: [number, number][] = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ];
  return possibleNeighbors
    .filter((c): c is [number, number] => isOnBoard(c))
    .map(flatten);
}

export const N = 19;
export const NN = N * N;
export const WHITE = "O", BLACK = "X", EMPTY = ".";
export const EMPTY_BOARD = EMPTY.repeat(NN);
export const NEIGHBORS: number[][] = Array.from({ length: NN }, (_, fc) =>
  getValidNeighbors(fc)
);
