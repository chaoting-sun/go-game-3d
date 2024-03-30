import { WHITE, BLACK, EMPTY } from "./constants";

export enum CellState {
  Empty = EMPTY,
  White = WHITE,
  Black = BLACK,
}

export type StoneColor = CellState.Black | CellState.White;