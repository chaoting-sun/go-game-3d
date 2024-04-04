import { LibertyTracker } from "./libertyTracker";
import { CellState, StoneColor } from "./types";
import { EMPTY_BOARD, N } from "./constants"; // Import necessary utilities and constants
import { placeStone, isKoish, bulkPlaceStones, swapColors } from "./utils";

export class GoPosition {
  board: string;
  ko: number | null;
  step: number;
  libertyTracker: LibertyTracker;

  constructor(
    board: string,
    ko: number | null,
    step: number,
    libertyTracker: LibertyTracker
  ) {
    this.board = board;
    this.ko = ko;
    this.step = step;
    this.libertyTracker = libertyTracker;
  }

  static initial_state(): GoPosition {
    // Assuming LibertyTracker.fromBoard is a static method that accepts a board and returns a LibertyTracker instance
    return new GoPosition(
      EMPTY_BOARD,
      null,
      0,
      LibertyTracker.fromBoard(EMPTY_BOARD)
    );
  }

  getBoard(): string {
    return this.board;
  }

  toString(): string {
    // textwrap functionality in Python needs to be manually implemented in TypeScript
    // For simplicity, here's a basic version that breaks the board into lines
    return (
      this.board.match(new RegExp(".{1," + N + "}", "g"))?.join("\n") || ""
    );
  }

  isEmpty(fc: number): boolean {
    return this.board[fc] === CellState.Empty;
  }

  playMove(fc: number, color: StoneColor): GoPosition {
    console.log("playMove", fc, color);

    if (fc === this.ko) {
      throw new Error(`Move at ${fc} illegally retakes ko.`);
    }

    if (this.board[fc] !== CellState.Empty) {
      throw new Error(`Stone exists at ${fc}.`);
    }

    console.log("is koish");

    const possibleKoColor = isKoish(this.board, fc);

    console.log("new board");

    const newBoard = placeStone(color, this.board, fc);

    const [newLibertyTracker, capturedStones] = this.libertyTracker.addStone(
      color,
      fc
    );
    if (newLibertyTracker.getLiberties()[fc] === 0) {
      throw new Error(`Move at ${fc} is suicide.`);
    }

    const updatedBoard = bulkPlaceStones(
      CellState.Empty,
      newBoard,
      capturedStones
    );
    const oppColor = swapColors(color);

    let newKo: number | null = null;
    if (capturedStones.size === 1 && possibleKoColor === oppColor) {
      newKo = [...capturedStones][0];
    }

    return new GoPosition(
      updatedBoard,
      newKo,
      this.step + 1,
      newLibertyTracker
    );
  }

  score(): number {
    const board = this.board;
    // The scoring logic needs to be adapted from Python to TypeScript
    // Assuming the necessary logic for findReached, bulkPlaceStones is implemented
    // This is a simplified placeholder for the actual implementation
    return (
      (board.match(new RegExp(CellState.Black, "g")) || []).length -
      (board.match(new RegExp(CellState.White, "g")) || []).length
    );
  }

  getLiberties(): number[] {
    return this.libertyTracker.getLiberties();
  }
}
