import { CellState } from "./types";

interface GroupOptions {
  id: number;
  stones: Set<number>;
  liberties: Set<number>;
  color: CellState;
}

export class Group {
  id: number;
  stones: Set<number>;
  liberties: Set<number>;
  color: CellState;

  constructor({ id, stones, liberties, color }: GroupOptions) {
    this.id = id;
    this.stones = stones;
    this.liberties = liberties;
    this.color = color;
  }
}
