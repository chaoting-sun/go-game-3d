import { CellState } from "./types";
import { N } from "./constants";
import { NEIGHBORS } from "./constants";

export function placeStone(
  color: CellState,
  board: string,
  fc: number
): string {
  return board.substring(0, fc) + color + board.substring(fc + 1);
}

export function bulkPlaceStones(
  color: CellState | "?",
  board: string,
  stones: Set<number>
): string {
  // TypeScript doesn't have a direct equivalent to Python's bytearray for mutable strings,
  // so we work with the string as an array of characters.
  const chars = board.split("");
  stones.forEach((fc) => {
    chars[fc] = color;
  });
  return chars.join("");
}

export function swapColors(color: CellState): CellState {
  switch (color) {
    case CellState.Black:
      return CellState.White;
    case CellState.White:
      return CellState.Black;
    default:
      return color; // Assuming there's a default case or error handling
  }
}

export function flatten(c: [number, number]): number {
  return N * c[0] + c[1];
}

export function unflatten(fc: number): [number, number] {
  const x = Math.floor(fc / N);
  const y = fc % N;
  return [x, y];
}

export function isOnBoard(c: [number, number]): boolean {
  return c[0] >= 0 && c[0] < N && c[1] >= 0 && c[1] < N;
}

export function isKoish(board: string, fc: number): CellState | null {
  // Check if the cell at the position `fc` is not empty
  if (board[fc] !== CellState.Empty) return null;

  // Gather the colors of neighboring cells
  const neighborColors: Set<CellState> = new Set();
  NEIGHBORS[fc].forEach((fn) => {
    neighborColors.add(board[fn] as CellState);
  });

  // If there is exactly one color (excluding EMPTY) among the neighbors,
  // return that color
  if (neighborColors.size === 1 && !neighborColors.has(CellState.Empty)) {
    return neighborColors.values().next().value;
  } else {
    return null;
  }
}

export function findReached(
  board: string,
  fc: number
): [Set<number>, Set<number>] {
  const color = board[fc];
  const chain: Set<number> = new Set([fc]);
  const reached: Set<number> = new Set();
  const frontier: number[] = [fc];

  while (frontier.length > 0) {
    const currentFc = frontier.pop();
    if (currentFc === undefined) {
      continue;
    }
    chain.add(currentFc);

    NEIGHBORS[currentFc].forEach((fn) => {
      if (board[fn] === color && !chain.has(fn)) {
        frontier.push(fn);
      } else if (board[fn] !== color) {
        reached.add(fn);
      }
    });
  }
  return [chain, reached];
}